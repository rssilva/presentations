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
baseImage.src = 'bowie2.jpg'

baseImage.onload = function () {
  kanvasOrigin.context.drawImage(baseImage, 0, 0, kanvasOrigin.context.canvas.width, kanvasOrigin.context.canvas.height)

  var worker = new Worker('worker1.js')

  worker.addEventListener('message', function(e) {
    console.log(e.data)
    console.timeEnd('closerPointsWorker')
    svg2.plotPaths(e.data.points)
  }, false)

  const imageData = kanvasOrigin.getImageData()
  const filtered = kanvasOrigin.getColor(imageData, {r: 165, g: 161, b: 154}, 60)
  const toBlack = kanvasOrigin.toBlack(imageData, {r: 255, g: 255, b: 255})
  const blackRGBMatrix = kanvasOrigin.toRGBMatrix(toBlack)
  const edgesMatrix = kanvasOrigin.getEdges(blackRGBMatrix)
  console.time('getMatrixData')
  const matrixData = kanvasOrigin.getMatrixData(edgesMatrix)
  console.timeEnd('getMatrixData')
  console.time('getCloserPoints')
  const closerPoints = PointUtils.getCloserPoints(matrixData)
  console.timeEnd('getCloserPoints')

  console.time('closerPointsWorker')
  worker.postMessage({cmd: 'getCloserPoints', matrix: matrixData})

  kanvasResult.plotImageData(filtered)
  kanvasResult.plotRGBMatrix(blackRGBMatrix)
  kanvasResult2.plotRGBMatrix(edgesMatrix)

  svg1.plotPoints(matrixData)
  // svg2.plotPaths(closerPoints)
}
