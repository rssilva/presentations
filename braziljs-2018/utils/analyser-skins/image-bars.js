const canvasUtils = new modules.CanvasUtils()

class ImageBars { // eslint-disable-line
  constructor (imageCanvas) {
    this.imageCanvas = imageCanvas
  }

  loadImage () {
    const baseImage = new Image()
    baseImage.src = '../../assets/images/david-bowie-low-small.jpg'

    baseImage.onload = () => {
      const { width, height } = this.imageCanvas.canvas
      this.imageWidth = width
      this.imageHeight = height

      this.imageCanvas.drawImage(baseImage, 0, 0, width, height)

      const imageInfo = this.imageCanvas.getImageData(0, 0, width, height)
      const imageData = imageInfo.data

      this.originalMatrix = canvasUtils.toMatrix(imageData, width)

      const gray = canvasUtils.toGrayScale(imageData)

      this.grayMatrix = canvasUtils.toMatrix(gray, width)
    }
  }

  set ({ fBufferLength, tBufferLength, canvasCtx, barWidth = 3 }) {
    this.fBufferLength = fBufferLength
    this.tBufferLength = tBufferLength
    this.canvasCtx = canvasCtx
    this.barWidth = barWidth

    this.width = canvasCtx.canvas.width
    this.height = canvasCtx.canvas.height
  }

  drawTime (dataArray) {
    this.canvasCtx.fillStyle = 'rgb(255, 255, 255)'
    this.canvasCtx.fillRect(0, 0, this.width, this.height)

    this.canvasCtx.beginPath()

    var sliceWidth = this.width * 1.0 / this.tBufferLength
    var x = 0

    for (let i = 0; i < this.tBufferLength; i++) {
      var v = dataArray[i] / 128
      var y = v * this.height / 2

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
    if (this.originalMatrix) {
      const merged = canvasUtils.mergeMatrix(this.originalMatrix, this.grayMatrix, bars)

      canvasUtils.plotMatrix({
        matrix: merged,
        context: this.canvasCtx,
        initialX: this.width / 2 - (this.imageWidth / 2),
        initialY: this.height / 2 - (this.imageHeight / 2)
      })
    }
  }
}
