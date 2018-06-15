const canvas1 = document.querySelector('#canvas1')
const context = canvas1.getContext('2d')

const width = context.canvas.width
const height = context.canvas.height
const xc = width / 2
const yc = height / 2

let radius = 2

let x = 0
let y = 0

context.beginPath()
context.moveTo(xc, yc)

let initialAngle = 0
let donePrint = true

const draw = () => {
  context.clearRect(0, 0, width, height)

  context.beginPath()

  context.moveTo(xc, yc)

  initialAngle += 0.1

  angle = initialAngle

  for (let r = 0; r < width/2; r += 0.5) {
    angle += 0.1

    x = r * Math.sin(2 * angle)
    y = r * Math.cos(2 * angle)

    context.lineTo(x + xc, y + yc)
  }

  context.stroke()

  window.requestAnimationFrame(draw)
}

draw()
