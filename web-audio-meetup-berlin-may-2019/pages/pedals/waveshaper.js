let audioContext
let analyser
let waveshaper

const canvasCtx = document.getElementById('analyser').getContext('2d')

canvasCtx.canvas.width = window.innerWidth
canvasCtx.canvas.height = window.innerHeight * 0.8

const start = () => {
  audioContext = new AudioContext()
  const pedalsUtils = new PedalsUtils()

  analyser = new modules.Analyser(audioContext, canvasCtx)

  pedalsUtils.getUserMedia(connectNodes)
}

const connectNodes = (stream) => {
  const audioInput = audioContext.createMediaStreamSource(stream)
  waveshaper = new WaveShaper({ audioContext })

  analyser.start()
  waveshaper.makeDistortionCurve(100)

  waveshaper.setInput(audioInput)

  waveshaper.node.connect(analyser.node)
  analyser.node.connect(audioContext.destination)

  bindEvents()
}

const bindEvents = () => {
  const delayValue = document.querySelector('.distortion-range-value')

  document.querySelector('.distortion-range').addEventListener('change', (e) => {
    const value = e.target.value

    delayValue.value = value
    waveshaper.makeDistortionCurve(Number(value))
  })
}

document.querySelector('.start').addEventListener('click', () => {
  start()
})
