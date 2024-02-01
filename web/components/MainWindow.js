import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { socket } from '../communication';

function useClientID() {
  const [clientID, setClientID] = useState('');

  useEffect(() => {
    socket
      .on('init', ({ userId }) => {
        document.title = `Meeting`;
        setClientID(userId);
      });
  }, []);

  return clientID;
}

function MainWindow({ joinRoom }) {
  const clientID = useClientID();
  const [roomId, setRoomId] = useState('');

  /**
   * Join a room
   */
  const joinRoomHandler = () => {
    const config = { audio: true, video: true };
    return () => roomId && joinRoom(roomId, config);
  };

  return (
    <div className="main-window">
      <div>
        <h4>
          Your ID is
          <input
            type="text"
            className="txt-clientId"
            defaultValue={clientID}
            readOnly
          />
        </h4>
      </div>
      <br/>
      <div>
        <h4>Join a room by typing the room ID below:</h4>
        <input
          type="text"
          className="txt-clientId"
          spellCheck={false}
          placeholder="Room ID"
          onChange={(event) => setRoomId(event.target.value)}
        />
        <div>
          <div className="btn-join" onClick={joinRoomHandler()}>Join now</div>
        </div>
      </div>
    </div>
  );
}

MainWindow.propTypes = {
  joinRoom: PropTypes.func.isRequired
};

export default MainWindow;
