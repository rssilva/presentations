let audioContext
let analyser
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

  let convolver = new Convolver({ audioContext })

  convolver.loadFile('../../assets/pedals/hall-reverb.ogg')

  analyser.start()

  audioInput.connect(convolver.node)
  convolver.node.connect(analyser.node)
  analyser.node.connect(audioContext.destination)

  bindEvents()
}

const bindEvents = () => {}

document.querySelector('.start').addEventListener('click', () => {
  start()
})
