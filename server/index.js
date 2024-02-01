const http = require( "http");
const socket = require('socket.io');
const initSocket = require('./lib/socket');
const httpServer = http.createServer();
const io = new socket.Server(httpServer, {
  path: '/bridge'
});

const port = 5000;

io.on("connection", (socket) => {
  initSocket(socket)
});

httpServer.listen(port, () => {
  console.log('Server is listening at :', port);
});