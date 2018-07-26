class ImagePedal { // eslint-disable-line
  constructor ({ audioContext, recorderClass, pedals, canvasUtils, audioUtils, canvasContext }) {
    this.audioContext = audioContext
    this.RecorderClass = recorderClass
    this.pedals = pedals
    this.canvasUtils = canvasUtils
    this.audioUtils = audioUtils
    this.canvasContext = canvasContext
  }

  createSource (signal) {
    const source = this.audioContext.createBufferSource()
    const buffer = this.audioContext.createBuffer(1, signal.length, this.audioContext.sampleRate)

    source.buffer = buffer
    source.looping = false

    return source
  }

  applyEffect (source, signal, pedal, partialCb) {
    const recorded = []
    const recorder = new this.RecorderClass(this.audioContext)

    const finish = (resolve) => {
      source.onended = () => {
        pedal.node.disconnect()
        recorder.node.disconnect()
        source.disconnect()

        resolve(recorded)
      }
    }

    const promise = new Promise(finish, () => console.log('deu ruim'))

    recorder.onAudioProcess((data) => {
      recorded.push(...data)

      if (partialCb) {
        partialCb(recorded)
      }
    })

    pedal.node.connect(recorder.node)
    recorder.node.connect(this.audioContext.destination)

    source.start(this.audioContext.currentTime)

    const data = source.buffer.getChannelData(0)

    for (let i = 0; i < signal.length; i += 1) {
      data[i] = signal[i]
    }

    return promise
  }

  setPedal (source, index) {
    let pedal = this.pedals[index]

    if (pedal.setInput) {
      pedal.setInput(source)
    }

    return pedal
  }

  applyAndPlot (splitted) {
    const parsedRed = this.canvasUtils.parseToAudio(splitted.red)
    let sourceRed = this.createSource(parsedRed)

    let pedal = this.setPedal(sourceRed, 0)

    this.applyEffect(sourceRed, parsedRed, pedal, (redData) => {
      this.plot(redData, [], [])
    }).then((red) => {
      const parsedGreen = this.canvasUtils.parseToAudio(splitted.green)
      let sourceGreen = this.createSource(parsedGreen)

      pedal = this.setPedal(sourceGreen, 1)

      this.applyEffect(sourceGreen, parsedGreen, pedal, (greenData) => {
        this.plot(red, greenData, [])
      }).then((green) => {
        const parsedBlue = this.canvasUtils.parseToAudio(splitted.blue)
        let sourceBlue = this.createSource(parsedBlue)

        pedal = this.setPedal(sourceBlue, 2)

        this.applyEffect(sourceBlue, parsedBlue, pedal, (blueData) => {
          this.plot(red, green, blueData)
        }).then((blue) => {
          // this.plot(red, green, blue)
        })
      })
    })
  }

  plot (red, green, blue) {
    const arr = this.canvasUtils.mountRGB({
      red: this.audioUtils.parseToImage(red),
      green: this.audioUtils.parseToImage(green),
      blue: this.audioUtils.parseToImage(blue),
      alpha: []
    })

    this.canvasUtils.plotArray(arr, this.canvasContext, false)
  }
}
