const canvas1 = document.querySelector('#canvas1')
const context = canvas1.getContext('2d')

const width = context.canvas.width
const height = context.canvas.height
const xc = width / 2
const yc = height / 2

context.fillStyle = 'dodgerblue'

const radius = 110

let x = radius
let y = yc

const draw = () => {
  // context.clearRect(0, 0, 300, 300)
  context.beginPath()
  // context.arc(xc, yc, radius, 0, 2 * Math.PI, false)
  context.stroke()

  x -= 2

  if (x < -radius) {
    x = radius
  }

  y = Math.sqrt(radius * radius - (x * x))

  context.fillRect(x + xc, yc + y, 3, 3)
  context.fillRect(x + xc, yc - y, 3, 3)

  window.requestAnimationFrame(() => {
    draw()
  })
}

draw()
