const canvas = document.querySelector('#canvas')
const context = canvas.getContext('2d')
const canvasUtils = new modules.CanvasUtils()

const graphContext1 = document.querySelector('#graph').getContext('2d')
const graphContext2 = document.querySelector('#graph2').getContext('2d')
const graphContext3 = document.querySelector('#graph3').getContext('2d')
const graphContext4 = document.querySelector('#graph4').getContext('2d')

const baseImage = new Image()
baseImage.src = '../../assets/images/david-bowie-low-small.jpg'

baseImage.onload = () => {
  const { width, height } = context.canvas

  context.drawImage(baseImage, 0, 0, width, height)

  const imageData = context.getImageData(0, 0, width, height)

  const axis = []

  imageData.data.forEach((val, i) => {
    axis.push(i)
  })

  const imageFilter = new Filter(new AudioContext())

  const splitted = canvasUtils.splitRGB(imageData.data)

  imageFilter.filterSignal(splitted.red, 'lowpass', 1000)
    .then((filtered) => {
      plotGraph({
        signals: [
          splitted.red.slice(0, 300),
          filtered.slice(0, 300)
        ],
        context: graphContext1,
        colors: ['red', 'white']
      })
    })
}
