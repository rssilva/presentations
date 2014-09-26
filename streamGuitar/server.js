var express = require('express');
var io = require('socket.io').listen(3001);
var app = express();
var port = 3004;

var server = app.listen(port); //the port you want to use
console.log('orientation listen on ' +  port)

app.use(express.static(__dirname));

io.on('connection', function (socket) {
  socket.on('rotate', function (data) {
  	io.sockets.emit('rotate', data)
  });
});