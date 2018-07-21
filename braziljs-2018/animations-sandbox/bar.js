const canvas = document.querySelector('#canvas')
const ctx = canvas.getContext('2d')

canvas.width = window.innerWidth - 10

const { width, height } = ctx.canvas

const barsSample = BARS // eslint-disable-line

// ff1e00 rgb(255, 30, 0)
// 2c2626 rgb(44,38,38)
// 5273ff rgb(82,115,255)

let currentRow = 0
let BAR_WIDTH = 1
let BAR_SPACE = 1

const draw = () => {
  ctx.clearRect(0, 0, width, height)

  currentRow++

  if (!barsSample[currentRow]) {
    currentRow = 0
  }

  const bars = barsSample[currentRow]

  BAR_WIDTH = Math.ceil(width / bars.length)

  // const red = `rgba(${255}, ${30}, ${0}, ${1})`
  const red = `hsla(7, 80%, 50%, 1)`
  const blue = `rgba(${82}, ${115}, ${255}, ${1})`
  // const black = `rgba(${44}, ${38}, ${38}, ${1})`

  bars.forEach((value, i) => {
    const colHeight = value * height / 255

    const x = i * (BAR_SPACE + BAR_WIDTH)
    const y = height - colHeight

    const gradient = ctx.createLinearGradient(x, height, x, value)
    gradient.addColorStop(0, red)
    gradient.addColorStop(0.7, blue)

    ctx.fillStyle = gradient
    // ctx.shadowBlur = 100
    // ctx.shadowColor = blue

    ctx.fillRect(x, y, BAR_WIDTH, colHeight)
  })

  setTimeout(draw, 100)
}

draw()

// const gradient1 = ctx.createLinearGradient(0, 0, 150, 0)
// gradient1.addColorStop(0, 'red')
// gradient1.addColorStop(1, 'blue')
// ctx.fillStyle = gradient1
// ctx.fillRect(0, 0, 300, 100)
//
// const gradient2 = ctx.createLinearGradient(0, 0, 150, 0)
// gradient2.addColorStop(0, 'green')
// gradient2.addColorStop(1, 'white')
// ctx.fillStyle = gradient2
//
// ctx.fillRect(0, 200, 300, 100)
