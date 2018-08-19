const audioContext = new AudioContext()
const analyser = new modules.Analyser(audioContext, document.getElementById('analyser').getContext('2d'))
const SAMPLE_RATE = audioContext.sampleRate

const duration = 0.5
const increment = 1 / SAMPLE_RATE
const RECORDED1 = []
const RECORDED2 = []

let recorder1 = new Recorder(audioContext, { channels: 1 }) // eslint-disable-line
let recorder2 = new Recorder(audioContext, { channels: 1 }) // eslint-disable-line
let convolver
// let concertHallBuffer
// let soundSource

const source = audioContext.createBufferSource()

let ajaxRequest = new XMLHttpRequest()
ajaxRequest.open('GET', '../assets/pedals/hall-reverb.ogg', true)
ajaxRequest.responseType = 'arraybuffer'

ajaxRequest.onload = function () {
  var audioData = ajaxRequest.response
  audioContext.decodeAudioData(audioData, function (buffer) {
    init(buffer)
  }, function (e) {
    console.log(`Error with decoding audio data ${e.err}`)
  })
}

ajaxRequest.send()

const init = (convolverBuffer) => {
  const signal = []

  for (let t = 0; t < (duration - increment); t += increment) {
    if (t < 0.00665) {
      signal.push(0.95 * Math.sin(2 * 3.14 * 300 * t))
    } else {
      signal.push(0)
    }
  }

  const buffer = audioContext.createBuffer(1, signal.length, audioContext.sampleRate)
  const data1 = buffer.getChannelData(0)

  for (let i = 0; i < signal.length; i += 1) {
    data1[i] = signal[i]
  }

  convolver = audioContext.createConvolver()
  convolver.buffer = convolverBuffer

  source.buffer = buffer
  source.looping = false

  recorder1.onAudioProcess((data) => {
    RECORDED1.push(...data)
  })

  recorder2.onAudioProcess((data) => {
    RECORDED2.push(...data)
  })

  source.connect(convolver)
  source.connect(recorder1.node)
  source.connect(analyser.node)
  recorder1.node.connect(audioContext.destination)

  convolver.connect(recorder2.node)
  recorder2.node.connect(audioContext.destination)

  analyser.start()

  source.start(audioContext.currentTime)

  source.onended = onEnded

  // stops song 1 second after starts, this will trigger 'onended' callback
  source.stop(audioContext.currentTime + 1)
}

const onEnded = () => {
  recorder1.node.disconnect()
  recorder2.node.disconnect()
  source.disconnect()
  analyser.node.disconnect()
  // delay.disconnect()

  plotGraph({
    signals: [
      RECORDED1.slice(0, 2500),
      RECORDED2.slice(0, 2500)
    ],
    context: document.getElementById('comparison').getContext('2d'),
    suggestedMin: -1,
    suggestedMax: 1,
    colors: ['orange', 'white']
  })
}
