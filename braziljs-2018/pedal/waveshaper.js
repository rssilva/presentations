var audioContext = new window.AudioContext()
var distortion = audioContext.createWaveShaper()

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

const axis = []

function makeDistortionCurve (amount) {
  var k = typeof amount === 'number' ? amount : 50
  var nSamples = 44100
  var curve = new Float32Array(nSamples)
  var deg = Math.PI / 180
  var x

  for (var i = 0; i < nSamples; ++i) {
    axis.push(i)
    x = i * 2 / nSamples - 1
    curve[i] = (3 + k) * x * 20 * deg / (Math.PI + k * Math.abs(x))
  }
  return curve
};

distortion.curve = makeDistortionCurve(400)
// distortion.oversample = '4x'

const fromMic = (stream) => {
  const audioInput = audioContext.createMediaStreamSource(stream)

  audioInput.connect(distortion)
  distortion.connect(audioContext.destination)
}

plotGraph({
  signals: [
    distortion.curve
  ],
  axis,
  context: document.getElementById('graph').getContext('2d'),
  suggestedMin: -1,
  suggestedMax: 1,
  colors: ['red', 'orange']
})

init()
