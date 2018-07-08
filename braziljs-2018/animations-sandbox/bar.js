const canvas = document.querySelector('#canvas')
const ctx = canvas.getContext('2d')

const { width, height } = ctx.canvas

const barsSample = BARS // eslint-disable-line

let currentRow = 0
const BAR_WIDTH = 5

const draw = () => {
  ctx.clearRect(0, 0, width, height)

  currentRow++

  if (!barsSample[currentRow]) {
    currentRow = 0
  }

  // const color = `hsla(${0}, ${50}%, ${50}%, ${1})`

  const bars = barsSample[currentRow]

  bars.forEach((value, i) => {
    const colHeight = value * height / 255
    const color = `rgba(${255}, ${Math.sin(value / 30) * 30 + 30}, ${0}, ${1})`

    ctx.fillStyle = color

    ctx.fillRect(i * (2 + BAR_WIDTH), height - colHeight, BAR_WIDTH, colHeight)
  })

  setTimeout(draw, 100)
}

draw()
