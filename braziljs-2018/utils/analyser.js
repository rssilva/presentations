class Analyser {
  constructor (audioContext, canvasCtx) {
    this.audioContext = audioContext
    this.canvasCtx = canvasCtx

    this.width = canvasCtx.canvas.width
    this.height = canvasCtx.canvas.height

    this.node = audioContext.createAnalyser()
    // this.node.smoothingTimeConstant = 0.9
    // this.node.fftSize = 128

    this.setTimeConfig()
    this.setFrequencyConfig()

    this.drawTime()
    this.drawFrequency()

    this.isDrawing = false
  }

  setTimeConfig () {
    const bufferLength = this.node.fftSize

    this.t = {
      bufferLength,
      dataArray: new Uint8Array(bufferLength)
    }
  }

  setFrequencyConfig () {
    const bufferLength = this.node.frequencyBinCount

    this.f = {
      dataArray: new Uint8Array(bufferLength),
      bufferLength: bufferLength,
      barWidth: (this.width / bufferLength) * 5
    }
  }

  drawTime () {
    window.requestAnimationFrame(() => this.drawTime())

    if (!this.isDrawing) {
      return
    }

    const analyser = this.node
    const canvasCtx = this.canvasCtx
    const bufferLength = this.t.bufferLength
    const dataArray = this.t.dataArray

    analyser.getByteTimeDomainData(this.t.dataArray)

    canvasCtx.fillStyle = 'rgb(255, 255, 255)'
    canvasCtx.fillRect(0, 0, this.width, this.height)

    canvasCtx.lineWidth = 2
    canvasCtx.strokeStyle = 'rgb(0, 100, 0)'

    canvasCtx.beginPath()

    var sliceWidth = this.width * 1.0 / bufferLength
    var x = 0

    for (let i = 0; i < bufferLength; i++) {
      var v = dataArray[i] / 128
      var y = v * this.height / 2

      if (i === 0) {
        canvasCtx.moveTo(x, y)
      } else {
        canvasCtx.lineTo(x, y)
      }

      x += sliceWidth
    }

    canvasCtx.lineTo(canvasCtx.width, canvasCtx.height / 2)
    canvasCtx.stroke()
  }

  drawFrequency () {
    window.requestAnimationFrame(() => this.drawFrequency())

    if (!this.isDrawing) {
      return
    }

    const analyser = this.node

    analyser.getByteFrequencyData(this.f.dataArray)

    let x = 0

    for (let i = 0; i < this.f.bufferLength; i++) {
      let barHeight = this.f.dataArray[i]

      this.canvasCtx.fillStyle = 'rgb(' + (barHeight + 10) + ', 50, 50)'
      this.canvasCtx.fillRect(x, this.height - 1.4 * barHeight, this.f.barWidth, barHeight * 1.4)

      x += this.f.barWidth + 2
    }
  }

  start () {
    this.isDrawing = true
  }

  stop () {
    this.isDrawing = false
  }
}

modules.Analyser = Analyser
