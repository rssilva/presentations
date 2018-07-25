const canvas = document.querySelector('#canvas')
const ctx = canvas.getContext('2d')
const barsSample = BARS // eslint-disable-line

const canvas2 = document.querySelector('#canvas2')
const ctx2 = canvas2.getContext('2d')

const lightning1 = new Lightning({ // eslint-disable-line
  ctx,
  colors: [{r: 82, g: 115, b: 255}, {r: 44, g: 38, b: 38}, {r: 255, g: 30, b: 0}],
  width: 692,
  startY: 0
})

const lightning2 = new Lightning({ // eslint-disable-line
  ctx: ctx2,
  // colors: [`rgba(${82}, ${115}, ${255}, ${1})`, 'rgb(44,38,38)', `rgba(${255}, ${30}, ${0}, ${1})`],
  colors: [{r: 82, g: 115, b: 255}, {r: 44, g: 38, b: 38}, {r: 255, g: 30, b: 0}],
  width: 300,
  startY: 10
})

canvas.width = window.innerWidth - 10

const { width, height } = ctx.canvas

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

  const red = `rgba(${255}, ${30}, ${0}, ${1})`
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

    ctx.fillRect(x, y, BAR_WIDTH, colHeight)
  })
  //

  // setTimeout(draw, 100)
  // setTimeout(draw, 100)
}

// draw()
lightning1.draw()
lightning2.draw()
