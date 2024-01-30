import MediaDevice from './MediaDevice';
import Emitter from './Emitter';
import {socket, initSocket} from './socket';

const PC_CONFIG = { iceServers: [{ urls: ['stun:stun.l.google.com:19302'] }] };

class PeerConnection extends Emitter {
  /**
     * Create a PeerConnection.
     * @param {String} friendID - ID of the friend you want to call.
     */
  constructor(friendID) {
    initSocket();
    super();
    this.pc = new RTCPeerConnection(PC_CONFIG);
    this.pc.onicecandidate = (event) => {
      socket.emit('call', {
        to: this.friendID,
        candidate: event.candidate
      });
    }
    this.pc.ontrack = (event) => this.emit('peerStream', event.streams[0]);

    this.mediaDevice = new MediaDevice();
    this.friendID = friendID;
  }

  /**
   * Starting the call
   * @param {MediaStream} stream
   */
  setLocalStream(stream) {
    if (!stream)
      return this;
    stream.getTracks().forEach((track) => {
      this.pc.addTrack(track, stream);
    });

    return this;
  }

  /**
   * Stop the call
   * @param {Boolean} isStarter
   */
  stop() {
    this.mediaDevice.stop();
    this.pc.close();
    this.pc = null;
    this.off();
    return this;
  }

  createOffer() {
    this.pc.createOffer()
      .then(this.getDescription.bind(this))
      .catch((err) => console.log(err));
    return this;
  }

  createAnswer() {
    this.pc.createAnswer()
      .then(this.getDescription.bind(this))
      .catch((err) => console.log(err));
    return this;
  }

  /**
   * @param {RTCLocalSessionDescriptionInit} desc - Session description
   */
  getDescription(desc) {
    this.pc.setLocalDescription(desc);
    socket.emit('call', { to: this.friendID, sdp: desc });
    return this;
  }

  /**
   * @param {RTCSessionDescriptionInit} sdp - Session description
   */
  setRemoteDescription(sdp) {
    const rtcSdp = new RTCSessionDescription(sdp);
    this.pc.setRemoteDescription(rtcSdp);
    return this;
  }

  /**
   * @param {RTCIceCandidateInit} candidate - ICE Candidate
   */
  addIceCandidate(candidate) {
    if (candidate) {
      const iceCandidate = new RTCIceCandidate(candidate);
      this.pc.addIceCandidate(iceCandidate);
    }
    return this;
  }
}

export default PeerConnection;
