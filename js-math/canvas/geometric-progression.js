const canvas = document.getElementById('canvas')
var ctx = canvas.getContext('2d')
const { width, height } = ctx.canvas

let counter = 0

const initial = 10

for (let i = 0; i < 20; i += 1) {
  const side = initial * Math.pow(Math.sqrt(2), i)
  const angle = (counter % 2) * 45

  plotSquare(width/2, height/2, side, angle)

  counter++
}
