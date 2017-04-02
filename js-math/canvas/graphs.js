const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d')
const { width } = ctx.canvas
const xAxis = evaluateXAxis(0.1, 20, 0.01)

const sliceSize = width / (xAxis.length - 1)

const AMOUNT = 10
const TAX = 10
const points = []
const colors = ['#1aa6b7', '#fe424d', '#000']

let max = null
let min = null

for (let i = 0; i < xAxis.length; i++) {
  const a = 1 * Math.exp(-xAxis[i]/5)
  const b = 5 * Math.cos(xAxis[i])

  const values = [
    a,
    b,
    a * b
  ]

  const x = sliceSize * i

  const currentMax = _.max(values)
  const currentMin = _.min(values)

  max = currentMax > max ? currentMax : max
  min = currentMin < min ? currentMin : min

  points.push({x, values})
}

ctx.lineWidth = 2

plotGraphs(ctx, points, min, max, colors)
