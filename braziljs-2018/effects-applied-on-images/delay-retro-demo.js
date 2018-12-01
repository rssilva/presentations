const audioContext = new AudioContext()
const canvasContext = document.querySelector('#canvas').getContext('2d')
const canvasUtils = new modules.CanvasUtils()
const audioUtils = new modules.AudioUtils(audioContext)

let imagePedal

const init = () => {
  const pedal1 = new DelayRetro({ audioContext, value: 0.001, gain: 0.8 })
  const pedal2 = new DelayRetro({ audioContext, value: 0.001, gain: 0.8 })
  const pedal3 = new DelayRetro({ audioContext, value: 0.001, gain: 0.8 })

  imagePedal = new ImagePedal({
    audioContext,
    canvasUtils,
    audioUtils,
    recorderClass: Recorder,
    pedals: [pedal1, pedal2, pedal3],
    canvasContext: document.querySelector('#canvas2').getContext('2d')
  })

  loadImage()
}

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

init()
