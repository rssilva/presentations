var io = require('socket.io')(1337);

var users = [];

io.on('connection', function(socket){
	users.push(socket)
  	console.log('a user connected', users.length);

  	socket.on('disconnect', function () {
  		var index = users.indexOf(socket)
  		users.splice(index, 1);
  		console.log(index)
  	})

  	socket.on('message', function (data) {
  		socket.broadcast.emit('message', data)
  	})
});

console.log('live on ' + 1337);
