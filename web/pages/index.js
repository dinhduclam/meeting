import React, { Component } from 'react';
import _ from 'lodash';
import { socket, initSocket, PeerConnection, MediaDevice } from './communication';
import MainWindow from './components/MainWindow';
import CallWindow from './components/CallWindow';

class App extends Component {
  constructor() {
    super();
    this.state = {
      callWindow: '',
      localSrc: null,
      peerSrcs: {}
    };
    this.pc = {};
    this.roomId = null;
    this.roomMembers = [];
    this.config = null;
    this.userId = null;
    this.mediaDevice = new MediaDevice();
    this.joinRoomHandler = this.joinRoom.bind(this);
    this.endCallHandler = this.endCall.bind(this);
  }

  componentDidMount() {
    initSocket();

    this.mediaDevice
      .on('stream', (stream) => {
        this.setState({localSrc: stream});
      })
      .start();

    socket
      .on('init', ({ userId }) => {
        this.userId = userId;
      })
      .on('call', (data) => {
        if (!this.pc[data.from]){
          const peer = new PeerConnection(data.from)
            .on('peerStream', (src) => {
              this.state.peerSrcs[data.from] = src;
              this.setState({ peerSrcs: this.state.peerSrcs })
            })
            .setLocalStream(this.state.localSrc);
          this.pc[data.from] = peer;
        }
        if (data.sdp) {
          this.pc[data.from].setRemoteDescription(data.sdp);
          if (data.sdp.type === 'offer') this.pc[data.from].createAnswer();
        } else this.pc[data.from].addIceCandidate(data.candidate);
      })
      .on('joined', (data) => {
        this.roomMembers = JSON.parse(data.members ?? "[]");
        this.callAllMember();
      })
      .on('outed', (data) => {
        delete this.state.peerSrcs[data.userId];
        delete this.pc[data.userId];
        this.setState({ peerSrcs: this.state.peerSrcs })
      })
      .emit('init');
  }

  joinRoom(roomId, config) {
    socket.emit('join', {roomId});
    this.setState({ callWindow: 'active' });
    this.config = config;
  }

  callAllMember() {
    for (const member of this.roomMembers){
      if (member == this.userId)
        continue;
      const peer = new PeerConnection(member)
        .on('peerStream', (src) => {
          this.state.peerSrcs[member] = src;
          this.setState({ peerSrcs: this.state.peerSrcs })
        })
        .setLocalStream(this.state.localSrc)
        .createOffer();
      this.pc[member] = peer;
    }
  }

  endCall() {
    for (const peer in this.pc){
      this.pc[peer].stop();
    }
    this.pc = {};
    this.setState({
      callWindow: '',
      peerSrcs: {}
    });
    socket.emit('out');
  }

  render() {
    const { callWindow, localSrc, peerSrcs } = this.state;
    return (
      <div>
        {_.isEmpty(this.state.callWindow) && (
          <MainWindow joinRoom={this.joinRoomHandler} />
        )}
        {!_.isEmpty(this.state.callWindow) && (
          <CallWindow
            status={callWindow}
            localSrc={localSrc}
            peerSrcs={peerSrcs}
            config={this.config}
            mediaDevice={this.mediaDevice}
            endCall={this.endCallHandler}
          />
        )}
      </div>
    );
  }
}

export default App;
