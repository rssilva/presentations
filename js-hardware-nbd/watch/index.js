var watch = require('watch')
var fs = require('fs')

var five = require('johnny-five')
var board = new five.Board()
var led

board.on('ready', function() {
  led = new five.Led(13)
  led.stop()
  led.off()

  startWatch()
})

function startWatch () {
  var counter = 0

  watch.createMonitor('app/', function (monitor) {
    console.log('watch is watching YOU, app/')

    monitor.on('changed', function () {
      console.log('changed')

      led.blink(200, function () {
        // console.log('oi oi oi')
        counter++

        if (counter == 4) {
          console.log('para')
          led.stop()
          led.off()
          counter = 0
        }
      })

      // setTimeout(function () {
      //   console.log('para para para')
      //   led.stop()
      //   led.off()
      // }, 1000)
    })
  })
}
