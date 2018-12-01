const audioContext = new AudioContext()
const canvasContext = document.querySelector('#canvas').getContext('2d')
const canvasUtils = new modules.CanvasUtils()
const audioUtils = new modules.AudioUtils(audioContext)

const pedal1 = new Flanger({ audioContext, delayTime: 0.0015, feedbackValue: 0.6, speedValue: 0.4 })
const pedal2 = new Flanger({ audioContext, delayTime: 0.0015, feedbackValue: 0.6, speedValue: 0.4 })
const pedal3 = new Flanger({ audioContext, delayTime: 0.0015, feedbackValue: 0.6, speedValue: 0.4 })

const imagePedal = new ImagePedal({
  audioContext,
  canvasUtils,
  audioUtils,
  recorderClass: Recorder,
  pedals: [pedal1, pedal2, pedal3],
  canvasContext: document.querySelector('#canvas2').getContext('2d')
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

loadImage()
