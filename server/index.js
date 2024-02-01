const http = require('http');
const express = require('express');
const cors = require('cors');
const socket = require('./lib/socket');

const app = express();
const server = http.createServer(app);
const port = 5000;
app.use('/test', () => "Hello");

server.listen(port, () => {
  socket(server);
  console.log('Server is listening at :', port);
});
