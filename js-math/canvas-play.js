'use strict'

const canvasOrigin = document.getElementById('canvas')
const canvasResult = document.getElementById('canvas-result')
const KanvasOrigin = Kanvas.new()
const KanvasResult = Kanvas.new()

KanvasOrigin.init(canvasOrigin)
KanvasResult.init(canvasResult)

KanvasOrigin.context.fillStyle = 'tomato'
KanvasOrigin.context.fillRect(10, 10, 50, 30)
KanvasOrigin.context.fillStyle = 'limegreen'
KanvasOrigin.context.ellipse(60, 100, 50, 50, 0, 0, 2 * Math.PI)
KanvasOrigin.context.stroke()
KanvasOrigin.context.fillStyle = 'dodgerblue'
KanvasOrigin.context.fillRect(120, 30, 40, 100)
KanvasOrigin.context.fillStyle = '#FFFFFF'
KanvasOrigin.context.fillRect(130, 40, 20, 80)

var imageData = KanvasOrigin.getImageData()
// const filtered = KanvasOrigin.getColor(imageData, {r: 30, g: 144, b: 254, a: 255}, 2)
var toBlack = KanvasOrigin.toBlack(imageData)

KanvasResult.plotImageData(toBlack)
