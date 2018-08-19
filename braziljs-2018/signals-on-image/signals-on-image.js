const canvasUtils = new modules.CanvasUtils()

const canvas1 = document.getElementById('canvas')
const context1 = canvas1.getContext('2d')

const canvas2 = document.getElementById('canvas2')
const context2 = canvas2.getContext('2d')

let VALUE = 1

const bindEvents = () => {
  const divisorValue = document.querySelector('.divisor-range-value')

  document.querySelector('.divisor-range').addEventListener('change', (e) => {
    const value = e.target.value
    divisorValue.value = value
    VALUE = value
    // divisorValue.setValue(value)
    loadImage()
  })
}

const draw = (imageInfo) => {
  const splitted = canvasUtils.splitRGB(imageInfo.data)

  // const red = splitted.red.map((val, index) => {
  //   return 100 + 155 * (Math.sin(index / VALUE))
  // })

  const green = splitted.green.map((val, index) => {
    return 155 + 100 * (Math.sin(index / VALUE))
  })

  const blue = splitted.blue.map((val, index) => {
    return 155 + 100 * (Math.cos(index / VALUE))
  })

  // // splitted.red = red
  splitted.green = green
  splitted.blue = blue

  const toRGB = canvasUtils.mountRGB(splitted)

  canvasUtils.plotArray(toRGB, context2, true)
}

const loadImage = () => {
  const baseImage = new Image()
  baseImage.src = '../assets/images/david-bowie-low.jpg'

  baseImage.onload = () => {
    const { width, height } = context1.canvas

    context1.drawImage(baseImage, 0, 0, width, height)
    const imageInfo = context1.getImageData(0, 0, width, height)

    draw(imageInfo)
  }
}

loadImage()
bindEvents()
