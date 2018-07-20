const audioContext = new AudioContext()

const analyser = new modules.Analyser(audioContext, document.getElementById('analyser').getContext('2d'))
const audioUtils = new modules.AudioUtils(audioContext)

const RECORDED1 = []
const RECORDED2 = []

let source
let delay
let recorder1 = new Recorder(audioContext) // eslint-disable-line
let recorder2 = new Recorder(audioContext) // eslint-disable-line

audioUtils
  .loadSound('../sound-and-vision.mp3', audioContext)
  .then((buffer) => {
    source = audioContext.createBufferSource()
    delay = audioContext.createDelay(2)

    source.buffer = buffer
    source.looping = false
    delay.delayTime.setValueAtTime(0.01, audioContext.currentTime)

    recorder1.onAudioProcess((data) => {
      RECORDED1.push(...data)
    })

    recorder2.onAudioProcess((data) => {
      RECORDED2.push(...data)
    })

    source.connect(delay)
    source.connect(recorder1.node)
    source.connect(analyser.node)
    recorder1.node.connect(audioContext.destination)

    delay.connect(recorder2.node)
    recorder2.node.connect(audioContext.destination)

    analyser.start()

    source.start(audioContext.currentTime, 75)

    const duration = 1

    source.onended = onEnded

    source.stop(audioContext.currentTime + Math.round(duration))
  })

const onEnded = () => {
  recorder1.node.disconnect()
  recorder2.node.disconnect()
  source.disconnect()
  analyser.node.disconnect()
  delay.disconnect()

  const recordedToPlot = RECORDED1.slice(0, 600)

  const axis = []

  recordedToPlot.forEach((v, i) => axis.push(i))

  plotGraph({
    signals: [
      recordedToPlot,
      RECORDED2.slice(0, 600)
    ],
    axis,
    context: document.getElementById('comparison').getContext('2d'),
    suggestedMin: -1,
    suggestedMax: 1,
    colors: ['red', 'orange']
  })
}
