const users = require('./users');
const rooms = require('./rooms');

/**
 * Initialize when a connection is made
 * @param {SocketIO.Socket} socket
 */
module.exports = function initSocket(socket) {
  let userId;
  let roomId;
  socket
    .on('init', async () => {
      userId = await users.create(socket);
      if (userId) {
        socket.emit('init', { userId });
      } else {
        socket.emit('error', { message: 'Failed to generating user id' });
      }
    })
    .on('join', (data) => {
      roomId = rooms.join(data.roomId, userId);
      if (roomId) {
        members = rooms.getMembers(roomId);
        socket.emit('joined', { members: JSON.stringify(members) });
      } else {
        socket.emit('error', { message: 'Failed to join room' });
      }
    })
    .on('out', (data) => {
      rooms.out(roomId, userId);
      members = rooms.getMembers(roomId);
      for (member of members){
        const receiver = users.get(member);
        if (receiver) {
          receiver.emit('outed', { roomId, userId });
        }
      }
    })
    .on('call', (data) => {
      const receiver = users.get(data.to);
      if (receiver) {
        receiver.emit('call', { ...data, from: userId });
      } else {
        socket.emit('failed');
      }
    })
    .on('end', (data) => {
      const receiver = users.get(data.to);
      if (receiver) {
        receiver.emit('end');
      }
    })
    .on('disconnect', () => {
      users.remove(userId);
      console.log(userId, 'disconnected');
    });
}
