var app = require('http').createServer(handler)
var io = require('socket.io')(app);
var fs = require('fs');

app.listen(3000);

console.log('listening on 3000')

var five = require("johnny-five");
var board = new five.Board();
var proximity, piezo

board.on("ready", function() {
  proximity = new five.Proximity({
    controller: "HCSR04",
    pin: 7
  });

  piezo = new five.Piezo(3);

  console.log('sensor ready')
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

  if ((/main.js/).test(url)) {
    fs.readFile('main.js', handleRequest);
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

io.on('connection', function (socket) {
  if (proximity) {

    proximity.on('data', function() {
      console.log(this.cm + ' cm');

      socket.broadcast.emit('data', {distance: this.cm})
    });
  }

  // socket.on('diff', function (data) {
  //   setAngleByDiff(data.diff)
  // });
});
