const audioContext = new AudioContext()
const analyser = new modules.Analyser(audioContext, document.getElementById('analyser').getContext('2d'))
const SAMPLE_RATE = audioContext.sampleRate

const duration = 0.5
const increment = 1 / SAMPLE_RATE
const RECORDED1 = []
const RECORDED2 = []

let recorder1 = new Recorder(audioContext, { channels: 1, makeSound: false }) // eslint-disable-line
let recorder2 = new Recorder(audioContext, { channels: 1, makeSound: true }) // eslint-disable-line
// let concertHallBuffer
// let soundSource
const source = audioContext.createBufferSource()

const init = () => {
  const signal = []

  for (let t = 0; t < (duration - increment); t += increment) {
    signal.push(Math.sin(2 * 3.14 * 300 * t))
  }

  const buffer = audioContext.createBuffer(1, signal.length, audioContext.sampleRate)
  const data1 = buffer.getChannelData(0)

  for (let i = 0; i < signal.length; i += 1) {
    data1[i] = signal[i]
  }

  const waveshaper = new WaveShaper({ audioContext })
  waveshaper.makeDistortionCurve(400)

  source.buffer = buffer
  source.looping = false

  recorder1.onAudioProcess((data) => {
    RECORDED1.push(...data)
  })

  recorder2.onAudioProcess((data) => {
    RECORDED2.push(...data)
  })

  source.connect(waveshaper.node)
  source.connect(recorder1.node)
  source.connect(analyser.node)
  recorder1.node.connect(audioContext.destination)

  waveshaper.node.connect(recorder2.node)
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
      RECORDED1.slice(0, 500),
      RECORDED2.slice(0, 500)
    ],
    context: document.getElementById('comparison').getContext('2d'),
    suggestedMin: -1,
    suggestedMax: 1,
    colors: ['red', 'orange']
  })
}

init()
