const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d')
const { height, width } = ctx.canvas
const xAxis = []

for (let i = 0; i <= 24; i+= 0.1) {
  xAxis.push(i)
}

const AMOUNT = 10
const TAX = 10
const points = []
const colors = ['#1aa6b7', '#fe424d', '#000']

const sliceSize = width / (xAxis.length - 1)

let max = null
let min = null

for (let i = 0; i < xAxis.length; i++) {
  const values = [
    3 * Math.sin(xAxis[i]),
    2 * Math.sin(xAxis[i]),
    AMOUNT * Math.pow((1 + TAX/1000), xAxis[i])
  ]

  const x = sliceSize * i

  const currentMax = _.max(values)
  const currentMin = _.min(values)

  max = currentMax > max ? currentMax : max
  min = currentMin < min ? currentMin : min

  points.push({x, values})
}

const rangeSize = Math.abs(Math.abs(max) + Math.abs(min))
console.log(rangeSize, max, min)
ctx.lineWidth = 5

points[0].values.forEach((v, index) => {
  ctx.strokeStyle = colors[index]
  ctx.beginPath()

  points.forEach(({x, values}) => {
    let scaledY = (values[index] / rangeSize) * height
    scaledY += Math.abs(min) / rangeSize * height

    ctx.lineTo(x, height - scaledY)
  })

  ctx.stroke()
})
