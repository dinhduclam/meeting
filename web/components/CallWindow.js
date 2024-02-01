/* eslint-disable jsx-a11y/media-has-caption */
import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { faPhone, faVideo, faMicrophone } from '@fortawesome/free-solid-svg-icons';
import ActionButton from './ActionButton';

function CallWindow({ peerSrcs, localSrc, config, mediaDevice, status, endCall }) {
  const peerVideo = [useRef(null),useRef(null),useRef(null),useRef(null),useRef(null),useRef(null),useRef(null)];
  const localVideo = useRef(null);
  const [video, setVideo] = useState(config.video);
  const [audio, setAudio] = useState(config.audio);

  useEffect(() => {
    var idx = 0;
    for (const key in peerSrcs){
      peerVideo[idx++].current.srcObject = peerSrcs[key];
    }
    if (localVideo.current && localSrc) localVideo.current.srcObject = localSrc;
  });

  useEffect(() => {
    if (mediaDevice) {
      mediaDevice.toggle('Video', video);
      mediaDevice.toggle('Audio', audio);
    }
  });

  /**
   * Turn on/off a media device
   * @param {'Audio' | 'Video'} deviceType - Type of the device eg: Video, Audio
   */
  const toggleMediaDevice = (deviceType) => {
    if (deviceType === 'Video') {
      setVideo(!video);
    }
    if (deviceType === 'Audio') {
      setAudio(!audio);
    }
    mediaDevice.toggle(deviceType);
  };

  return (
    <div className={classnames('call-window', status)}>
      <div id='video-area'>
        {
          Object.keys(peerSrcs).map((key, idx) => (
            <div className="video peer">
              <video key={key} className="peerVideo" ref={peerVideo[idx]} autoPlay />
              <label>{key}</label>
            </div>
          ))
        }
      </div>
      <div className="local-video">
        <video id="localVideo" ref={localVideo} autoPlay muted />
      </div>
      <div className="video-control">
        <ActionButton
          key="btnVideo"
          icon={faVideo}
          disabled={!video}
          onClick={() => toggleMediaDevice('Video')}
        />
        <ActionButton
          key="btnAudio"
          icon={faMicrophone}
          disabled={!audio}
          onClick={() => toggleMediaDevice('Audio')}
        />
        <ActionButton
          className="hangup"
          icon={faPhone}
          onClick={() => endCall()}
        />
      </div>
    </div>
  );
}

CallWindow.propTypes = {
  status: PropTypes.string.isRequired,
  localSrc: PropTypes.object, // eslint-disable-line
  peerSrcs: PropTypes.object, // eslint-disable-line
  config: PropTypes.shape({
    audio: PropTypes.bool.isRequired,
    video: PropTypes.bool.isRequired
  }).isRequired,
  mediaDevice: PropTypes.object, // eslint-disable-line
  endCall: PropTypes.func.isRequired
};

export default CallWindow;
