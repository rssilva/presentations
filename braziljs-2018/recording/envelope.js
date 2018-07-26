const audioContext = new AudioContext()
const analyser = new modules.Analyser(audioContext, document.getElementById('analyser').getContext('2d'))
const SAMPLE_RATE = audioContext.sampleRate

const duration = 1
const increment = 1 / SAMPLE_RATE
const RECORDED1 = []
const RECORDED2 = []

let recorder1 = new Recorder(audioContext, { channels: 1, makeSound: false }) // eslint-disable-line
let recorder2 = new Recorder(audioContext, { channels: 1, makeSound: true }) // eslint-disable-line
// const source = audioContext.createBufferSource()
const source = audioContext.createOscillator()
source.frequency.value = 50
source.type = 'square'

const init = () => {
  const signal = []

  for (let t = 0; t < (duration - increment); t += increment) {
    signal.push(Math.sin(2 * 3.14 * 70 * t))
  }

  // const buffer = audioContext.createBuffer(1, signal.length, audioContext.sampleRate)
  // const data1 = buffer.getChannelData(0)
  //
  // for (let i = 0; i < signal.length; i += 1) {
  //   data1[i] = signal[i]
  // }

  const envelope = new Envelope({ audioContext, attack: 0.3, sustain: 0.4, release: 0.2 })

  // source.buffer = buffer
  // source.looping = false

  recorder1.onAudioProcess((data) => {
    RECORDED1.push(...data)
  })

  recorder2.onAudioProcess((data) => {
    RECORDED2.push(...data)
  })

  source.connect(envelope.node)
  source.connect(recorder1.node)
  envelope.node.connect(analyser.node)
  recorder1.node.connect(audioContext.destination)

  envelope.node.connect(recorder2.node)
  recorder2.node.connect(audioContext.destination)

  analyser.start()

  source.start(audioContext.currentTime)
  envelope.run()

  source.onended = onEnded

  // stops song 1 second after starts, this will trigger 'onended' callback
  source.stop(audioContext.currentTime + duration)
}

const onEnded = () => {
  recorder1.node.disconnect()
  recorder2.node.disconnect()
  source.disconnect()
  analyser.node.disconnect()

  plotGraph({
    signals: [
      RECORDED2
    ],
    context: document.getElementById('comparison').getContext('2d'),
    suggestedMin: -1,
    suggestedMax: 1,
    colors: ['red', 'orange']
  })
}

init()
