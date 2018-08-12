class Aladdin { // eslint-disable-line
  constructor (drawLightning = false) {
    this.drawLightning = drawLightning
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
    this.canvasCtx.fillStyle = 'rgb(0, 0, 0)'
    this.canvasCtx.fillRect(0, 0, this.width, this.height)

    this.canvasCtx.strokeStyle = 'rgb(255, 255, 255)'
    this.canvasCtx.lineWidth = 3

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
    const BAR_SPACE = 1

    const red = `hsla(7, 80%, 50%, 1)`
    const blue = `rgba(${82}, ${115}, ${255}, ${1})`

    if (this.drawLightning) {
      this.lightning.draw()
    }

    for (let i = 0; i < this.fBufferLength; i++) {
      const value = bars[i]
      const colHeight = value * this.height / 255

      const x = i * (BAR_SPACE + this.barWidth)
      const y = this.height - colHeight

      const gradient = this.canvasCtx.createLinearGradient(x, this.height, x, value)
      gradient.addColorStop(0, red)
      gradient.addColorStop(0.7, blue)

      this.canvasCtx.fillStyle = gradient
      this.canvasCtx.shadowBlur = 2
      this.canvasCtx.shadowColor = '#FFF'

      if (i < this.width) {
        this.canvasCtx.fillRect(x, y, this.barWidth, colHeight)
      }
    }
  }

  setLightning () {
    this.lightning = new Lightning({ // eslint-disable-line
      ctx: this.canvasCtx,
      colors: [{r: 82, g: 115, b: 255}, {r: 44, g: 38, b: 38}, {r: 255, g: 30, b: 0}],
      width: this.height / 1.5,
      startY: 0
    })
  }
}
