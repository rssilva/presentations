let audioContext
let analyser
let delay1
const canvasCtx = document.getElementById('analyser').getContext('2d')

canvasCtx.canvas.width = window.innerWidth
canvasCtx.canvas.height = window.innerHeight

const start = () => {
  audioContext = new AudioContext()
  const pedalsUtils = new PedalsUtils()

  analyser = new modules.Analyser(audioContext, canvasCtx)

  pedalsUtils.getUserMedia(connectNodes)
}

const connectNodes = (stream) => {
  const audioInput = audioContext.createMediaStreamSource(stream)
  delay1 = new DelayRetro({ audioContext, value: 3 })

  analyser.start()

  // audioInput.connect(delay1.node)
  delay1.setInput(audioInput)
  // audioInput.connect(analyser.node)
  delay1.node.connect(analyser.node)

  audioInput.connect(audioContext.destination)
  analyser.node.connect(audioContext.destination)

  bindEvents()
}

const bindEvents = () => {
  const delayValue = document.querySelector('.delay-range-value')
  const gainValue = document.querySelector('.gain-range-value')

  document.querySelector('.delay-range').addEventListener('change', (e) => {
    const value = e.target.value

    delayValue.value = value
    delay1.setValue(value)
  })

  document.querySelector('.gain-range').addEventListener('change', (e) => {
    const value = e.target.value

    gainValue.value = value
    delay1.setGain(value)
  })
}

document.querySelector('.start').addEventListener('click', () => {
  start()
})
