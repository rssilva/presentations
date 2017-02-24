var five = require("johnny-five")
var board = new five.Board()
var proximity, piezo
var EVENTS

var calendarEvents = require('./calendar-events')

calendarEvents.getEvents(function (events) {
  // onData(events)
  console.log('events...')
  EVENTS = events
})

setInterval(function () {
  calendarEvents.getEvents(function (events) {
    // onData(events)
    console.log('events...')
    EVENTS = events
  })
}, 30000)

board.on("ready", function() {
  proximity = new five.Proximity({
    controller: "HCSR04",
    pin: 7
  })

  proximity.on('data', function() {
    // console.log(this.cm + ' cm')
    onDistance(this.cm)
  })

  piezo = new five.Piezo(3);

  console.log('sensor ready')
})

function onDistance (distance) {
  // console.log(distance, EVENTS)
  if (distance < 30 && EVENTS) {
    searchEvents(EVENTS)
  }

  if (distance > 30) {
    piezo.off()
  }
}

function searchEvents (events) {
  var patt = /hometask.*/gi

  events.forEach(function (event) {
    if ((patt).test(event.summary)) {
      checkEvent(event)
    }
  })
}

function checkEvent (event) {
  var now = new Date()

  var start = new Date(event.start.dateTime)
  var end = new Date(event.end.dateTime)
  console.log('check', start, now, end)
  if (start < now && now < end) {
    piezo.play(200, 200);
    console.log(event)
  }
}
