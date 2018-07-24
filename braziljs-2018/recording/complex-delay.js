const audioContext = new AudioContext()
const analyser = new modules.Analyser(audioContext, document.getElementById('analyser').getContext('2d'))
const SAMPLE_RATE = audioContext.sampleRate

class ComplexDelay { // eslint-disable-line
  constructor ({ audioContext, value = 0.1 }) {
    const delay1 = audioContext.createDelay()
    const delay2 = audioContext.createDelay()

    delay1.delayTime.setValueAtTime(value, audioContext.currentTime)
    delay2.delayTime.setValueAtTime(value, audioContext.currentTime)

    const outputGain = audioContext.createGain()
    const inputGain = audioContext.createGain()

    outputGain.value = 1

    this.inputGain = inputGain

    inputGain.connect(delay1)
    inputGain.connect(delay2)
    delay1.connect(outputGain)
    delay2.connect(outputGain)

    this.node = outputGain
  }

  setInput (input) {
    input.connect(this.inputGain)
  }
}

const duration = 0.5
const increment = 1 / SAMPLE_RATE
const RECORDED1 = []
const RECORDED2 = []
const RECORDED3 = []

let sourceRecorder = new Recorder(audioContext, { channels: 1 }) // eslint-disable-line
let recorder1 = new Recorder(audioContext, { channels: 1 }) // eslint-disable-line
let recorder2 = new Recorder(audioContext, { channels: 1 }) // eslint-disable-line

let pedal

const source = audioContext.createBufferSource()

const init = () => {
  const signal = []
  pedal = new ComplexDelay({ audioContext, value: 0.001 })

  for (let t = 0; t < (duration - increment); t += increment) {
    signal.push(Math.sin(2 * 3.14 * 200 * t))
  }

  const buffer = audioContext.createBuffer(1, signal.length, audioContext.sampleRate)
  const data1 = buffer.getChannelData(0)

  for (let i = 0; i < signal.length; i += 1) {
    data1[i] = signal[i]
  }

  source.buffer = buffer
  source.looping = false

  pedal.setInput(source)

  sourceRecorder.onAudioProcess((data) => {
    RECORDED1.push(...data)
  })

  recorder1.onAudioProcess((data) => {
    RECORDED2.push(...data)
  })

  // recorder2.onAudioProcess((data) => {
  //   RECORDED3.push(...data)
  // })

  source.connect(analyser.node)
  source.connect(sourceRecorder.node)
  sourceRecorder.node.connect(audioContext.destination)

  pedal.node.connect(recorder1.node)
  recorder1.node.connect(audioContext.destination)

  recorder2.node.connect(audioContext.destination)

  analyser.start()

  source.start(audioContext.currentTime)

  source.onended = onEnded

  // stops song 1 second after starts, this will trigger 'onended' callback
  source.stop(audioContext.currentTime + 0.5)
}

const onEnded = () => {
  sourceRecorder.node.disconnect()
  recorder1.node.disconnect()
  recorder2.node.disconnect()
  source.disconnect()
  analyser.node.disconnect()

  plotGraph({
    signals: [
      RECORDED1.slice(0, 1000),
      RECORDED2.slice(0, 1000)
      // RECORDED3.slice(0, 1000),
    ],
    context: document.getElementById('comparison').getContext('2d'),
    suggestedMin: -1,
    suggestedMax: 1,
    colors: ['red', 'orange', 'blue']
  })
}

init()
