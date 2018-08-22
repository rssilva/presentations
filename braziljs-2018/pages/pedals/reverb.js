const audioContext = new AudioContext()
const canvasCtx = document.getElementById('analyser').getContext('2d')
const pedalsUtils = new PedalsUtils()

canvasCtx.canvas.width = window.innerWidth
canvasCtx.canvas.height = window.innerHeight

const analyser = new modules.Analyser(audioContext, canvasCtx)
let convolver = new Convolver({ audioContext })

convolver.loadFile('../../assets/pedals/hall-reverb.ogg')

const connectNodes = (stream) => {
  const audioInput = audioContext.createMediaStreamSource(stream)

  analyser.start()

  audioInput.connect(convolver.node)
  convolver.node.connect(analyser.node)
  analyser.node.connect(audioContext.destination)

  bindEvents()
}

const bindEvents = () => {}

pedalsUtils.getUserMedia(connectNodes)
