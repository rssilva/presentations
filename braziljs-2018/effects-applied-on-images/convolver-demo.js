const audioContext = new AudioContext()
const canvasContext = document.querySelector('#canvas').getContext('2d')
const canvasUtils = new modules.CanvasUtils()
const audioUtils = new modules.AudioUtils(audioContext)
let imagePedal
const pedal1 = new Convolver({ audioContext })

pedal1.loadFile('../assets/pedals/hall-reverb.ogg').then((buffer) => {
  const pedal2 = new Convolver({ audioContext })
  const pedal3 = new Convolver({ audioContext })

  pedal1.setBuffer(buffer)
  pedal2.setBuffer(buffer)
  pedal3.setBuffer(buffer)

  imagePedal = new ImagePedal({
    audioContext,
    canvasUtils,
    audioUtils,
    recorderClass: Recorder,
    pedals: [pedal1, pedal2, pedal3],
    canvasContext: document.querySelector('#canvas2').getContext('2d')
  })

  loadImage()
})

const loadImage = () => {
  const baseImage = new Image()
  baseImage.src = '../assets/images/david-bowie-earthling.jpg'

  baseImage.onload = () => {
    const { width, height } = canvasContext.canvas

    canvasContext.drawImage(baseImage, 0, 0, width, height)
    const imageInfo = canvasContext.getImageData(0, 0, width, height)
    const splitted = canvasUtils.splitRGB(imageInfo.data)

    imagePedal.applyAndPlot(splitted)
  }
}
