const canvasUtils = new modules.CanvasUtils()

const barsSample = BARS // eslint-disable-line

let currentRow = 0
let merged

const canvasResult = document.getElementById('canvas-result')
const contextResult = canvasResult.getContext('2d')

const draw = (originalMatrix, grayMatrix) => {
  currentRow++

  if (!barsSample[currentRow]) {
    currentRow = 0
  }

  const bars = barsSample[currentRow]

  merged = canvasUtils.mergeMatrix(grayMatrix, originalMatrix, bars)
  canvasUtils.plotMatrix(merged, contextResult)

  setTimeout(() => {
    draw(originalMatrix, grayMatrix)
  }, 100)
}

const baseImage = new Image()
baseImage.src = '../david-bowie-low-small.jpg'

baseImage.onload = () => {
  const context1 = document.getElementById('canvas-image').getContext('2d')
  const { width, height } = context1.canvas

  context1.drawImage(baseImage, 0, 0, width, height)
  const imageInfo = context1.getImageData(0, 0, width, height)
  const imageData = imageInfo.data

  // const splitted = canvasUtils.splitRGB(imageData)

  // const changed = canvasUtils.drawColumn(imageData, width, 250)
  const originalMatrix = canvasUtils.toMatrix(imageData, width)
  // const originalMatrix2 = canvasUtils.toMatrixByColumns(imageData, width, height)
  const gray = canvasUtils.toGrayScale(imageData)

  canvasUtils.plotArray(gray, document.getElementById('canvas-gray').getContext('2d'))

  const grayMatrix = canvasUtils.toMatrix(gray, width)
  // canvasUtils.plotMatrix(grayMatrix, contextResult)
  // const points = grayMatrix.map((arr, i) => 150 + 100 * Math.sin(i / 5))
  // merged = canvasUtils.mergeMatrix(grayMatrix, originalMatrix, points)
  // canvasUtils.plotMatrix(merged, contextResult)
  // const toRGB = canvasUtils.mountRGB(splitted)
  // console.log(splitted)
  // canvasUtils.plotArray(changed, contextResult)
  draw(originalMatrix, grayMatrix)
}
