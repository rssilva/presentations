const audioContext = new AudioContext()
const analyser = new modules.Analyser(audioContext, document.getElementById('canvas').getContext('2d'))
analyser.start()

const init = function () {
  if (!navigator.getUserMedia) {
    navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia
  }

  if (navigator.getUserMedia) {
    navigator.getUserMedia({ audio: true }, success, function (e) {
      console.log('error')
    })
  } else {
    console.log('getUserMedia not supported in this browser.')
  }

  function success (stream) {
    fromMic(stream)
  }
}

const Modulator = (input, audioContext) => {
  const masterGain = audioContext.createGain()
  const carrier = audioContext.createOscillator()
  const carrierGain = audioContext.createGain()
  const modulator = audioContext.createOscillator()
  const modulatorGain = audioContext.createGain()

  carrier.type = 'sine'
  carrier.frequency.value = 100

  modulator.frequency.value = 500
  modulator.type = 'sine'
  modulatorGain.gain.value = 300

  carrier.connect(carrierGain)
  carrierGain.connect(masterGain)

  modulator.connect(modulatorGain)
  modulatorGain.connect(carrier.frequency)

  // setTimeout(() => {
  //   carrier.frequency.exponentialRampToValueAtTime(200, audioContext.currentTime + 0.5)
  // }, 500)

  masterGain.gain.value = 0.2

  carrier.start()
  modulator.start()

  return masterGain
}

const fromMic = (stream) => {
  const audioInput = audioContext.createMediaStreamSource(stream)

  const modulator = Modulator(audioInput, audioContext)

  modulator.connect(audioContext.destination)
}

const modulator = Modulator('', audioContext)
modulator.connect(analyser.node)
analyser.node.connect(audioContext.destination)

setTimeout(() => {
  modulator.disconnect()
  analyser.stop()
}, 2000)
