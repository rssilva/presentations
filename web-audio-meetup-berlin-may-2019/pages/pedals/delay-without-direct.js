let audioContext
let analyser

const canvasCtx = document.getElementById('analyser').getContext('2d')

canvasCtx.canvas.width = window.innerWidth
canvasCtx.canvas.height = window.innerHeight * 0.9

const start = () => {
  audioContext = new AudioContext()
  const pedalsUtils = new PedalsUtils()

  analyser = new modules.Analyser(audioContext, canvasCtx)

  pedalsUtils.getUserMedia(connectNodes)
}

const connectNodes = (stream) => {
  const audioInput = audioContext.createMediaStreamSource(stream)
  const delay = audioContext.createDelay(3)
  delay.delayTime.setValueAtTime(3, audioContext.currentTime)

  analyser.start()

  audioInput.connect(delay)
  // audioInput.connect(analyser.node)
  delay.connect(analyser.node)

  analyser.node.connect(audioContext.destination)

  bindEvents()
}

const bindEvents = () => {

}

document.querySelector('.start').addEventListener('click', () => {
  start()
})
