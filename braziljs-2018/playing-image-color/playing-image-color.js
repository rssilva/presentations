const audioContext = new AudioContext()
const SAMPLE_RATE = audioContext.sampleRate

const analyser = new modules.Analyser(audioContext, document.getElementById('canvas1').getContext('2d'))
const audioUtils = new modules.AudioUtils(audioContext)
const canvasUtils = new modules.CanvasUtils()

const canvas2 = document.getElementById('canvas2')
const context = canvas2.getContext('2d')

analyser.start()

const baseImage = new Image()
baseImage.src = './david-bowie-low.jpg'

baseImage.onload = () => {
  const { width, height } = context.canvas

  context.drawImage(baseImage, 0, 0, width, height)
  const imageInfo = context.getImageData(0, 0, width, height)

  const splitted = canvasUtils.splitRGB(imageInfo.data)

  const parsed = splitted.red.map((value) => {
    return (value - 127.5) / 127.5
  })

  const node = audioUtils.playSignal({ signal: parsed, sampleRate: SAMPLE_RATE })

  node.connect(analyser.node)
}
