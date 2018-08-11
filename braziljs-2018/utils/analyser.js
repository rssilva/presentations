class AnalyserDefaultSkin {
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

    this.canvasCtx.lineWidth = 2
    this.canvasCtx.strokeStyle = 'rgb(0, 100, 0)'

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
    let x = 0

    for (let i = 0; i < this.fBufferLength; i++) {
      let barHeight = bars[i]

      this.canvasCtx.fillStyle = 'rgb(' + (barHeight + 10) + ', 50, 50)'
      this.canvasCtx.fillRect(x, this.height - 1.4 * barHeight, this.barWidth, barHeight * 1.4)

      x += this.barWidth + 2
    }
  }
}

const defaultSkin = new AnalyserDefaultSkin()

class Analyser {
  constructor (audioContext, canvasCtx, { skin = defaultSkin } = {}) {
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

    this.skin = skin
    this.skin.set({
      fBufferLength: this.node.frequencyBinCount,
      tBufferLength: this.node.fftSize,
      canvasCtx
    })

    this.isDrawing = false
  }

  setTimeConfig () {
    const bufferLength = this.node.fftSize

    this.t = {
      bufferLength
    }
  }

  setFrequencyConfig () {
    const bufferLength = this.node.frequencyBinCount

    this.f = {
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
    const bufferLength = this.t.bufferLength
    const dataArray = new Uint8Array(bufferLength)

    analyser.getByteTimeDomainData(dataArray)

    this.skin.drawTime(dataArray)
  }

  drawFrequency () {
    window.requestAnimationFrame(() => this.drawFrequency())

    if (!this.isDrawing) {
      return
    }

    const analyser = this.node
    const dataArray = new Uint8Array(this.f.bufferLength)

    analyser.getByteFrequencyData(dataArray)
    this.skin.drawFrequency(dataArray)
  }

  start () {
    this.isDrawing = true
  }

  stop () {
    this.isDrawing = false
  }
}

modules.Analyser = Analyser
