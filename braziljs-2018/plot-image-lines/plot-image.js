const canvas = document.querySelector('#canvas')
const context = canvas.getContext('2d')

const canvasUtils = new modules.CanvasUtils()

const graphContext1 = document.querySelector('#graph').getContext('2d')
const graphContext2 = document.querySelector('#graph2').getContext('2d')
const graphContext3 = document.querySelector('#graph3').getContext('2d')
const graphContext4 = document.querySelector('#graph4').getContext('2d')

const baseImage = new Image()
baseImage.src = '../assets/images/david-bowie-low-small.jpg'

baseImage.onload = () => {
  const { width, height } = context.canvas

  context.drawImage(baseImage, 0, 0, width, height)

  const imageData = context.getImageData(0, 0, width, height)

  const axis = []

  imageData.data.forEach((val, i) => {
    axis.push(i)
  })

  plotGraph({
    signals: [imageData.data.slice(0, 300)],
    axis: axis.slice(0, 300),
    context: graphContext1,
    colors: ['orange'],
    suggestedMax: 260
  })

  const withoutAlpha = canvasUtils.removeAlpha(imageData.data)

  plotGraph({
    signals: [withoutAlpha.slice(0, 300)],
    axis: axis.slice(0, 300),
    context: graphContext2,
    colors: ['orange'],
    suggestedMax: 260
  })

  const splitted = canvasUtils.splitRGB(imageData.data)

  plotGraph({
    signals: [
      splitted.red.slice(0, 300),
      splitted.green.slice(0, 300),
      splitted.blue.slice(0, 300)
    ],
    axis: axis.slice(0, 300),
    context: graphContext3,
    colors: ['red', 'green', 'blue'],
    suggestedMax: 260
  })

  plotGraph({
    signals: [
      splitted.red.slice(60300, 60600),
      splitted.green.slice(60300, 60600),
      splitted.blue.slice(60300, 60600)
    ],
    axis: axis.slice(0, 300),
    context: graphContext4,
    colors: ['red', 'green', 'blue'],
    suggestedMax: 260
  })
}
