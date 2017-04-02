const canvas = document.getElementById('canvas')
var ctx = canvas.getContext('2d')
const { width, height } = ctx.canvas

let counter = 0
const squareSide = 50 * Math.sqrt(2)/2
const initial = 10

for (let i = 0; i < 20; i += 1) {
  const side = initial * Math.pow(1.41, i)
  plotSquare(width/2, height/2, side, Math.round(Math.sin(counter % 2)) * 45)

  counter++
}
