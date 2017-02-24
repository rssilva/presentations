var five = require('johnny-five');
var http = require('http');
var Router = require('node-simple-router');
var router = Router();

var board = new five.Board();

var server = http.createServer(router);

server.listen(3000);

board.on('ready', function() {
  var servo = new five.Servo.Continuous(10).stop();
  var piezo = new five.Piezo(3);
  var photoValue;

  var photoresistor = new five.Sensor({
    pin: "A2",
    freq: 500
  });

  photoresistor.on("data", function() {
    photoValue = this.value;
  });

  servo.stop(0);

  router.get('/servo/angle/:val', function(request, response) {
    var angle = request.params.val;

    if (0 <= angle <= 180) {
      servo.to(request.params.val)
    } else {
      servo.stop(0);
    }

    response.end('servo');
  });

  router.get('/piezo/:freq', function(request, response) {
    var freq = request.params.freq;

    piezo.play(freq, 200);

    response.end('piezo');
  });

  router.get('/piezo/stop', function(request, response) {
    piezo.off();

    response.end('piezo');
  });

  router.get('/photo', function(request, response) {
    response.end('photo : ' + photoValue);
  });

})

console.log('on 3000');
