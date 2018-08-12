const audioContext = new AudioContext()
const analyser = new modules.Analyser(audioContext, document.getElementById('analyser').getContext('2d'))
const audioUtils = new modules.AudioUtils(audioContext)

const RECORDED1 = []

let recorder1 = new Recorder(audioContext, { channels: 1, makeSound: false }) // eslint-disable-line
let audioInput

const init = (stream) => {
  audioInput = audioContext.createMediaStreamSource(stream)

  const waveshaper = new WaveShaper({ audioContext })
  waveshaper.makeDistortionCurve(400)

  recorder1.onAudioProcess((data) => {
    RECORDED1.push(...data)
  })

  audioInput.connect(recorder1.node)
  audioInput.connect(analyser.node)
  recorder1.node.connect(audioContext.destination)

  analyser.start()

  // stops song 1 second after starts, this will trigger 'onended' callback
  setTimeout(() => {
    onEnded()
  }, 1000)
}

const onEnded = () => {
  recorder1.node.disconnect()
  audioInput.disconnect()
  analyser.node.disconnect()

  plotGraph({
    signals: [
      RECORDED1.slice(1000, 1500)
    ],
    context: document.getElementById('comparison').getContext('2d'),
    suggestedMin: -1,
    suggestedMax: 1,
    colors: ['red', 'orange']
  })
}

setTimeout(() => {
  audioUtils.getUserMedia(init)
}, 2000)
