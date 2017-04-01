const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d')
const { height, width } = ctx.canvas
const xAxis = []

for (let i = 0; i <= 24; i++) {
  xAxis.push(i)
}

// [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24]

ctx.beginPath()

const amount = 100
const tax = 10

ctx.strokeStyle = '#1aa6b7'
ctx.lineWidth = 5

for (let i = 0; i < xAxis.length; i++) {
  const value = amount * Math.pow((1 + tax/100), i)

  ctx.lineTo(i, value)
}

ctx.stroke()
