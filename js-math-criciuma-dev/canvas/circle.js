const canvas1 = document.querySelector('#canvas1')
const context = canvas1.getContext('2d')

const width = context.canvas.width
const height = context.canvas.height
const xc = width / 2
const yc = height / 2

context.fillStyle = 'dodgerblue'

const radius = width / 2.5

let x = radius
let y = yc

const start = new Date().getTime()
let t = 0

const ps = new ParticleSource(context, {x, y})
let first = true

const draw = () => {
  context.clearRect(0, 0, width, height)

  t = new Date().getTime() - start
  x = radius * Math.sin(t/1000)

  y = Math.sqrt(radius * radius - (x * x))

  ps.setPosition(x + xc, yc - y)
  ps.draw()

  if (first) {
    ps.setParticles()
    first = false
  }

  // context.stroke()

  window.requestAnimationFrame(() => {
    draw()
  })
  // setTimeout(() => {
  //   draw()
  // }, 500)
}

draw()
