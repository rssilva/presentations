var app = require('http').createServer(handler)
var io = require('socket.io')(app);
var fs = require('fs');

app.listen(3000);

console.log('listening on 3000')

var five = require("johnny-five");
var board = new five.Board();
var angle = 90;
var servo

board.on("ready", function() {
  servo = new five.Servo(10);

  servo.to(angle);

  this.repl.inject({
    servo: servo
  });

});


function handler (req, res) {
  var url = req.url
  console.log(url)
  if ((/\/{1}$/).test(url)) {
    fs.readFile(__dirname + '/index.html', handleRequest)
  }

  if ((/lodash/).test(url)) {
    fs.readFile('../lodash.js', handleRequest);
  }

  if ((/projector.html/).test(url)) {
    fs.readFile('projector.html', handleRequest);
  }


  function handleRequest (err, data) {
    if (err) {
      res.writeHead(500);
      return res.end('Error loading ' + req.url);
    }

    res.writeHead(200);
    res.end(data);
  }
}

function setAngleByDiff (diff) {
  var to = Math.abs(diff - 90);
  // console.log(to)
  if (to > 175) {
    to = 175
  }

  if (to < 5) {
    to = 5
  }

  if (servo) {
    // servo.to(to)
    smoothTo(to)
  }
}

function smoothTo (to) {
  var inc = -3

  if (to > angle) {
    inc = 3
  }
  
  // console.log(angle, to, inc)
  if (inc == -3 && angle > to) {
    angle += inc
  }

  if (inc == 3 && angle < to) {
    angle += inc
  }

  servo.to(angle)
  
}

io.on('connection', function (socket) {
  socket.on('diff', function (data) {
    setAngleByDiff(data.diff)
    // socket.broadcast.emit('canvasData', {data: data})
  });
});