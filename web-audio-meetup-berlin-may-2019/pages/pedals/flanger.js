let audioContext
let analyser
let flanger

const canvasCtx = document.getElementById('analyser').getContext('2d')

canvasCtx.canvas.width = window.innerWidth
canvasCtx.canvas.height = window.innerHeight * 0.7

const start = () => {
  audioContext = new AudioContext()
  const pedalsUtils = new PedalsUtils()

  analyser = new modules.Analyser(audioContext, canvasCtx)

  pedalsUtils.getUserMedia(connectNodes)
}

const connectNodes = (stream) => {
  const audioInput = audioContext.createMediaStreamSource(stream)
  flanger = new Flanger({ audioContext })

  analyser.start()

  // audioInput.connect(flanger.node)
  flanger.setInput(audioInput)
  flanger.node.connect(analyser.node)

  analyser.node.connect(audioContext.destination)

  bindEvents()
}

const bindEvents = () => {
  const delayValue = document.querySelector('.delay-range-value')
  const feedbackValue = document.querySelector('.feedback-range-value')
  const speedValue = document.querySelector('.speed-range-value')
  const depthValue = document.querySelector('.depth-range-value')

  document.querySelector('.delay-range').addEventListener('change', (e) => {
    const value = e.target.value

    delayValue.value = value
    flanger.setDelay(value)
  })

  document.querySelector('.feedback-range').addEventListener('change', (e) => {
    const value = e.target.value

    feedbackValue.value = value
    flanger.setFeedback(value)
  })

  document.querySelector('.speed-range').addEventListener('change', (e) => {
    const value = e.target.value

    speedValue.value = value
    flanger.setSpeed(value)
  })

  document.querySelector('.depth-range').addEventListener('change', (e) => {
    const value = e.target.value

    depthValue.value = value
    flanger.setDepth(value)
  })
}

document.querySelector('.start').addEventListener('click', () => {
  start()
})
