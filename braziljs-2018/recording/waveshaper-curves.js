const audioContext = new AudioContext()
const analyser = new modules.Analyser(audioContext, document.getElementById('analyser').getContext('2d'))

const RECORDED1 = []

let recorder1 = new Recorder(audioContext, { channels: 1, makeSound: false }) // eslint-disable-line
// let recorder2 = new Recorder(audioContext, { channels: 1, makeSound: true }) // eslint-disable-line

const source = audioContext.createBufferSource()
let curve1 = []
let curve2 = []

const init = () => {
  const signal = SAMPLE // eslint-disable-line

  const buffer = audioContext.createBuffer(1, signal.length, audioContext.sampleRate)
  const data1 = buffer.getChannelData(0)

  for (let i = 0; i < signal.length; i += 1) {
    data1[i] = signal[i]
  }

  const waveshaper = new WaveShaper({ audioContext })
  curve1 = waveshaper.makeDistortionCurve(400)
  curve2 = waveshaper.makeDistortionCurve2(600)

  source.buffer = buffer
  source.looping = false

  recorder1.onAudioProcess((data) => {
    RECORDED1.push(...data)
  })

  waveshaper.setInput(source)

  waveshaper.node.connect(analyser.node)
  waveshaper.node.connect(recorder1.node)
  recorder1.node.connect(audioContext.destination)
  analyser.node.connect(audioContext.destination)

  analyser.start()

  source.start(audioContext.currentTime)

  source.onended = onEnded

  // stops song 1 second after starts, this will trigger 'onended' callback
  source.stop(audioContext.currentTime + 2)
}

const onEnded = () => {
  recorder1.node.disconnect()
  source.disconnect()
  analyser.node.disconnect()
  // delay.disconnect()

  // plotGraph({
  //   signals: [
  //     RECORDED1.slice(RECORDED1.length - 1000)
  //   ],
  //   context: document.getElementById('comparison').getContext('2d'),
  //   suggestedMin: -1,
  //   suggestedMax: 1,
  //   colors: ['red', 'orange']
  // })

  plotGraph({
    signals: [
      curve1.slice(21000, 23000),
      curve2.slice(21000, 23000)
    ],
    context: document.getElementById('curve').getContext('2d'),
    suggestedMin: -1,
    suggestedMax: 1,
    colors: ['red', 'orange']
  })
}

init()
