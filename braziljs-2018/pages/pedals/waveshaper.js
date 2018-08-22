const audioContext = new AudioContext()
const canvasCtx = document.getElementById('analyser').getContext('2d')
const pedalsUtils = new PedalsUtils()

canvasCtx.canvas.width = window.innerWidth
canvasCtx.canvas.height = window.innerHeight

let waveshaper
const analyser = new modules.Analyser(audioContext, canvasCtx)

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

pedalsUtils.getUserMedia(connectNodes)
