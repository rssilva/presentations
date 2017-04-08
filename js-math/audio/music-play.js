const audioContext = new AudioContext()
const canvas = document.getElementById('canvas')
const canvasCtx = canvas.getContext('2d')

const analyser = startAnalyser(audioContext, canvasCtx)
const filter = audioContext.createBiquadFilter()
filter.type = 'highpass'
filter.frequency.value = 10
// filter.Q.value = 0.1

function getData(audioCtx) {
  source = audioCtx.createBufferSource()
  var request = new XMLHttpRequest()

  request.open('GET', '1984.mp3', true)

  request.responseType = 'arraybuffer'

  request.onload = function() {
    var audioData = request.response

    audioCtx.decodeAudioData(audioData, function(buffer) {
        source.buffer = buffer
        source.connect(filter)
        filter.connect(analyser)
        analyser.connect(audioContext.destination)

        source.loop = true

        source.start(audioContext.currentTime, 0)
        // source.stop(audioContext.currentTime + 0.8)
      },
      function(e){ console.log("Error with decoding audio data" + e.err) })
  }

  request.send()
}

getData(audioContext)
