'use strict'

const canvasOrigin = document.getElementById('canvas')
const canvasResult = document.getElementById('canvas-result')
const canvasResult2 = document.getElementById('canvas-result2')

const kanvasOrigin = Kanvas.new()
const kanvasResult = Kanvas.new()
const kanvasResult2 = Kanvas.new()
const svg1 = SVG.new()
const svg2 = SVG.new()

kanvasOrigin.init(canvasOrigin)
kanvasResult.init(canvasResult)
kanvasResult2.init(canvasResult2)

svg1.init(document.getElementById('svg1'))
svg2.init(document.getElementById('svg2'))

const baseImage = new Image()
baseImage.src = 'hand.jpg'

baseImage.onload = function () {
  kanvasOrigin.context.drawImage(baseImage, 0, 0, 200, 356)

  const imageData = kanvasOrigin.getImageData()
  const filtered = kanvasOrigin.getColor(imageData, {r: 165, g: 161, b: 154}, 60)
  const toBlack = kanvasOrigin.toBlack(imageData, {r: 165, g: 161, b: 154})
  const blackRGBMatrix = kanvasOrigin.toRGBMatrix(toBlack)
  const edgesMatrix = kanvasOrigin.getEdges(blackRGBMatrix)
  const matrixData = kanvasOrigin.getMatrixData(edgesMatrix)
  const closerPoints = PointUtils.getCloserPoints(matrixData)

  kanvasResult.plotImageData(filtered)
  // kanvasResult.plotRGBMatrix(blackRGBMatrix)
  kanvasResult2.plotRGBMatrix(edgesMatrix)

  svg1.plotPoints(matrixData)
  svg2.plotLines(closerPoints)
}
