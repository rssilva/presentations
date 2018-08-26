class AnalyserRealTime {
  constructor (audioContext, opts = {}, cb) {
    this.audioContext = audioContext
    // this.canvasCtx = canvasCtx

    // this.width = canvasCtx.canvas.width
    // this.height = canvasCtx.canvas.height

    this.node = audioContext.createAnalyser()
    // this.node.smoothingTimeConstant = 0.9
    // this.node.fftSize = 128

    this.setTimeConfig()
    this.setFrequencyConfig()

    // this.drawTime()
    this.drawFrequency(cb)

    // this.skin = skin
    // this.skin.set({
    //   fBufferLength: this.node.frequencyBinCount,
    //   tBufferLength: this.node.fftSize,
    //   canvasCtx
    // })

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
      bufferLength: bufferLength
      // barWidth: (this.width / bufferLength) * 5
    }
  }

  drawTime () {
    // window.requestAnimationFrame(() => this.drawTime())

    if (!this.isDrawing) {
      return
    }

    const analyser = this.node
    const bufferLength = this.t.bufferLength
    const dataArray = new Uint8Array(bufferLength)

    analyser.getByteTimeDomainData(dataArray)

    // this.skin.drawTime(dataArray)
  }

  drawFrequency (cb) {
    window.requestAnimationFrame(() => this.drawFrequency(cb))

    if (!this.isDrawing) {
      return
    }

    const analyser = this.node
    const dataArray = new Uint8Array(this.f.bufferLength)

    analyser.getByteFrequencyData(dataArray)
    cb(dataArray)
    // this.skin.drawFrequency(dataArray)
  }

  start () {
    this.isDrawing = true
  }

  stop () {
    this.isDrawing = false
  }
}
