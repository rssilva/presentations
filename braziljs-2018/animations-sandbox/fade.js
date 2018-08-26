const canvasUtils = new modules.CanvasUtils()

const barsSample = BARS // eslint-disable-line

const canvasResult = document.getElementById('canvas-result')
const contextResult = canvasResult.getContext('2d')

contextResult.canvas.width = window.innerWidth
// contextResult.canvas.height = window.innerHeight

let currentRow = 0
let currentLine = 0

let fadeImage

const draw = () => {
  // console.log(height, width)
  const { height, width } = contextResult.canvas
  currentRow++

  contextResult.clearRect(0, 0, width, height)

  if (!barsSample[currentRow]) {
    currentRow = 0
  }

  fadeImage.movePixels()

  setTimeout(() => {
    draw()
  }, 10)
}

const baseImage = new Image()
baseImage.src = '../assets/images/david-bowie-low-small100x100.jpg'

baseImage.onload = () => {
  const context1 = document.getElementById('canvas-image').getContext('2d')
  const { width, height } = context1.canvas

  context1.drawImage(baseImage, 0, 0, width, height)
  const imageInfo = context1.getImageData(0, 0, width, height)
  const imageData = imageInfo.data

  const originalMatrix = canvasUtils.toMatrix(imageData, width)

  fadeImage = new FadeImage(contextResult, {
    originalMatrix
  })

  draw()
}

class FadeImage {
  constructor (context, { originalMatrix }) {
    this.context = context
    this.isDestructured = false

    // const startTime = new Date().getTime()
    const canvasWidth = context.canvas.width
    const canvasHeight = context.canvas.height
    const width = originalMatrix[0].length
    const height = originalMatrix.length

    const initialY = Math.round((canvasHeight - height) / 2)
    const initialX = Math.round((canvasWidth - width) / 2)

    canvasUtils.plotMatrix({
      matrix: originalMatrix,
      context,
      initialX,
      initialY
    })
    this.matrix = canvasUtils.cloneMatrixAddingPositions(originalMatrix, initialX, initialY)

    this.addDestination(this.matrix, canvasWidth)
  }

  addDestination (matrix, canvasWidth) {
    let row
    let number = 0

    for (let i = 0; i < matrix.length; i++) {
      row = matrix[i]

      for (let k = 0; k < row.length; k++) {
        number++

        if (number > canvasWidth) {
          number = 0
        }

        matrix[i][k] = {
          ...matrix[i][k],
          number
        }
      }
    }
  }

  movePixels () {
    if (!this.matrix[currentLine]) {
      currentLine = 0
      this.isDestructured = true
    }

    this.matrix[currentLine].forEach((pixel, i) => {
      const pos = this.evaluateNewPosition({
        x: pixel.x,
        y: pixel.y,
        width: this.matrix[0].length,
        index: i,
        number: pixel.number
      })

      pixel.x = pos.x
      pixel.y = pos.y
    })

    currentLine++

    this.drawPixels()
  }

  evaluateNewPosition ({x, y, width, index, number}) {
    let newX
    let newY

    if (this.isDestructured) {
      newY = y + Math.round(Math.random() * 5)

      if (x != number) {
        let signal = x < number ? +1 : -1
        newX = x + signal * 50
      }
    } else {
      let signal = x < number ? +1 : -1
      newX = x + signal * Math.round(Math.random() * 10)
      newY = y + signal * Math.round(Math.random() * 10)
    }

    return {
      x: newX,
      y: newY
    }
  }

  drawPixels () {
    this.matrix.forEach((row) => {
      row.forEach((pixel) => {
        this.context.fillStyle = `rgba(${pixel.r}, ${pixel.g}, ${pixel.b}, 1)`
        this.context.fillRect(pixel.x, pixel.y, 1, 1)
      })
    })
  }
}
