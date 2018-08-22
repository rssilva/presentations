const audioContext = new AudioContext()
const SAMPLE_RATE = audioContext.sampleRate

const aladdinSkin = new Aladdin(true) // eslint-disable-line

const analyser = new modules.Analyser(audioContext, document.getElementById('canvas1').getContext('2d'), {
  skin: aladdinSkin
})

aladdinSkin.setLightning()

const audioUtils = new modules.AudioUtils(audioContext)
const canvasUtils = new modules.CanvasUtils()

const canvas2 = document.getElementById('canvas2')
const context = canvas2.getContext('2d')
let node
let parsed

analyser.start()

const baseImage = new Image()
baseImage.src = '../../assets/images/david-bowie-low.jpg'

baseImage.onload = () => {
  const { width, height } = context.canvas

  context.drawImage(baseImage, 0, 0, width, height)
  const imageInfo = context.getImageData(0, 0, width, height)

  const splitted = canvasUtils.splitRGB(imageInfo.data)

  parsed = splitted.red.map((value) => {
    return (value - 127.5) / 127.5
  })

  // const node = audioUtils.playSignal({ signal: parsed, sampleRate: SAMPLE_RATE })

  // node.connect(analyser.node)
}

const play = () => {
  const node = audioUtils.playSignal({ signal: parsed, sampleRate: SAMPLE_RATE })

  node.connect(analyser.node)
}

const bindEvents = () => {
  $('#play-button').on('click', play)
}

bindEvents()
