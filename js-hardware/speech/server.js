var five = require('johnny-five')
var http = require('http')
var fs = require('fs')
var Router = require('node-simple-router')
var router = Router()

var board = new five.Board()

var server = http.createServer(router)
var led

server.listen(3000)

board.on('ready', function() {
  led = new five.Led(13)

  led.off()

  router.get('/', function (request, response) {
    fs.readFile('./index.html', 'utf-8', function (err, data) {
      response.end(data)
    })
  })

  router.get('/jquery.js', function (request, response) {
    fs.readFile('./jquery.js', 'utf-8', function (err, data) {
      response.end(data)
    })
  })

  router.post('/data', function (request, response) {
    console.log(request.body.text)
    onData(request.body.text)
    response.end('got it')
  })
})

function onData (text) {
  if (/.*on.*/g.test(text)) {
    led.on()
  }

  if (/.*stop.*/g.test(text)) {
    led.stop()
    led.off()
  }

  if (/.*blink.*/g.test(text)) {
    led.blink(500)
  }
}

console.log('on 3000')
