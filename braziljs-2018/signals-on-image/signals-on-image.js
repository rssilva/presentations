const canvasUtils = new modules.CanvasUtils()

const canvas1 = document.getElementById('canvas')
const context1 = canvas1.getContext('2d')

const canvas2 = document.getElementById('canvas2')
const context2 = canvas2.getContext('2d')

const baseImage = new Image()
baseImage.src = './david-bowie-low.jpg'

baseImage.onload = () => {
  const { width, height } = context1.canvas

  context1.drawImage(baseImage, 0, 0, width, height)
  const imageInfo = context1.getImageData(0, 0, width, height)

  const splitted = canvasUtils.splitRGB(imageInfo.data)
  const green = splitted.green.map((val, index) => {
    return 120 + 100 * (Math.sin(index / 1000) + 2 * Math.cos(index))
  })
  splitted.green = green

  const toRGB = canvasUtils.mountRGB(splitted)
  console.log(splitted)
  canvasUtils.plotArray(toRGB, context2, true)
}
