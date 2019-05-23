class FadeImageSkin { // eslint-disable-line
  constructor ({ imageCanvasCtx, canvasUtils, image }) {
    this.imageCanvasCtx = imageCanvasCtx
    this.canvasUtils = canvasUtils

    this.image = image

    this.isDestructured = false
    this.onPlace = {}
  }

  set ({ fBufferLength, tBufferLength, canvasCtx, barWidth = 3 }) {
    this.canvasCtx = canvasCtx

    this.fBufferLength = fBufferLength
    this.tBufferLength = tBufferLength
    this.canvasCtx = canvasCtx
    this.barWidth = barWidth

    // const startTime = new Date().getTime()
    this.canvasWidth = canvasCtx.canvas.width
    this.canvasHeight = canvasCtx.canvas.height

    this.currentLine = 0
  }

  drawFirst (originalMatrix) {
    const width = originalMatrix[0].length
    const height = originalMatrix.length

    const initialY = Math.round((this.canvasHeight - height) / 2)
    const initialX = Math.round((this.canvasWidth - width) / 2)

    this.canvasUtils.plotMatrix({
      matrix: originalMatrix,
      context: this.canvasCtx,
      initialX,
      initialY
    })

    this.matrix = this.canvasUtils.cloneMatrixAddingPositions(originalMatrix, initialX, initialY)

    this.addDestination(this.matrix, this.canvasWidth)
  }

  loadImage () {
    const baseImage = new Image()
    baseImage.src = this.image || '../assets/images/david-bowie-low-small100x100.jpg'

    baseImage.onload = () => {
      // const context1 = document.getElementById('canvas-image').getContext('2d')
      const { width, height } = this.imageCanvasCtx.canvas

      this.imageCanvasCtx.drawImage(baseImage, 0, 0, width, height)
      const imageInfo = this.imageCanvasCtx.getImageData(0, 0, width, height)
      const imageData = imageInfo.data

      const originalMatrix = this.canvasUtils.toMatrix(imageData, width)
      this.drawFirst(originalMatrix)
    }
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
    if (!this.matrix[this.currentLine]) {
      this.currentLine = 0
      this.isDestructured = true
    }

    this.matrix[this.currentLine].forEach((pixel, i) => {
      const pos = this.evaluateNewPosition({
        pixel,
        x: pixel.x,
        y: pixel.y,
        width: this.matrix[0].length,
        index: i,
        number: pixel.number
      })

      pixel.x = pos.x
      pixel.y = pos.y
    })

    this.currentLine++

    // this.drawPixels()
  }

  evaluateNewPosition ({x, y, width, index, number, pixel}) {
    let newX = x
    let newY = y

    if (this.isDestructured) {
      // newY = y + Math.round(Math.random() * 5)

      if (x != number) {
        let signal = x < number ? +1 : -1
        newX = x + signal * Math.abs(x - number) * Math.round(Math.random())
      } else {
        if (!this.onPlace[number]) {
          this.onPlace[number] = []
        }

        this.onPlace[number].push(pixel)
      }
    } else {
      let signal = x < number ? +1 : -1
      newX = x + signal * Math.round(Math.random() * 20)
      newY = y + signal * Math.round(Math.random() * 20)
    }

    return {
      x: newX,
      y: newY
    }
  }

  drawPixels () {
    const size = this.isDestructured ? 3 : 1
    this.matrix.forEach((row) => {
      row.forEach((pixel) => {
        this.canvasCtx.fillStyle = `rgba(${pixel.r}, ${pixel.g}, ${pixel.b}, 1)`
        this.canvasCtx.fillRect(pixel.x, pixel.y, size, size)
      })
    })
  }

  drawTime (dataArray) {
    if (!this.matrix) {
      return
    }
    this.canvasCtx.fillStyle = 'rgb(0, 0, 0)'
    this.canvasCtx.fillRect(0, 0, this.canvasWidth, this.canvasHeight)

    this.canvasCtx.strokeStyle = 'rgb(255, 255, 255)'
    this.canvasCtx.lineWidth = 1

    this.canvasCtx.beginPath()

    var sliceWidth = this.canvasWidth * 1.0 / this.tBufferLength
    var x = 0

    for (let i = 0; i < this.tBufferLength; i++) {
      var v = dataArray[i] / 128
      var y = v * this.canvasHeight / 2

      if (i === 0) {
        this.canvasCtx.moveTo(x, y)
      } else {
        this.canvasCtx.lineTo(x, y)
      }

      x += sliceWidth
    }

    this.canvasCtx.lineTo(this.canvasCtx.width, this.canvasCtx.height / 2)
    this.canvasCtx.stroke()
  }

  drawFrequency (bars) {
    if (!this.matrix) {
      this.loadImage()
      return
    } else {
    }

    // const BAR_SPACE = 1

    // const red = `hsla(7, 80%, 50%, 1)`
    // const blue = `rgba(${82}, ${115}, ${255}, ${1})`

    this.movePixels()

    for (let i = 0; i < this.fBufferLength; i += 1) {
      const value = bars[i]
      const colHeight = value * this.canvasHeight / 255

      // const x = i * (BAR_SPACE + this.barWidth)
      const y = this.canvasHeight - colHeight

      if (i < this.canvasWidth && this.onPlace[i]) {
        this.onPlace[i].forEach((pixel) => {
          pixel.y = y + Math.round(Math.random() * 5)
        })
      }
    }

    this.drawPixels()
  }
}
