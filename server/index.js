const http = require( "http");
const socket = require('socket.io');
const initSocket = require('./lib/socket');
const httpServer = http.createServer();
const io = new socket.Server(httpServer, {
  path: '/bridge',
  cors: {
    origin: ["http://localhost:3000", "*"],
  },
});

const port = 5000;

io.on("connection", (socket) => {
  initSocket(socket)
});

httpServer.listen(process.env.PORT || port, () => {
  console.log('Server is listening at :', port);
});