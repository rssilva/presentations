class EightBit { // eslint-disable-line
  constructor ({ audioContext, bufferSize = 4096, channels = 2, makeSound = true } = {}) {
    this.audioContext = audioContext

    this.stepDict = [-1, -0.6, -0.3, 0, 0.3, 0.6, 1]
    // this.stepDict = [-1, -0.5, -0.2, 0, 0.2, 0.5, 1]
    // this.stepDict = [-1, -0.5, 0, 0.5, 1]

    this.node = audioContext.createScriptProcessor(bufferSize, 2, channels)

    // const outputGain = audioContext.createGain()
    // const inputGain = audioContext.createGain()
    this.setAudioProcess()
  }

  setAudioProcess () {
    this.node.onaudioprocess = (ev) => {
      this.partialRecorded = []

      const inputData = ev.inputBuffer.getChannelData(0)
      const outputData = ev.outputBuffer.getChannelData(0)

      const length = inputData.length

      for (let sample = 0; sample < length; sample++) {
        outputData[sample] = this.roundTo(inputData[sample])
      }
    }
  }

  roundTo (num) {
    let counter = this.stepDict.length - 1
    let distanceToPrev
    let distanceToNext
    let rounded
    let minor = this.stepDict[counter]

    while (counter > -1) {
      distanceToPrev = Math.abs(this.stepDict[counter + 1] - num)
      distanceToNext = Math.abs(this.stepDict[counter] - num)

      if (distanceToNext < Math.abs(minor)) {
        minor = distanceToNext
        rounded = this.stepDict[counter]
      }

      if (distanceToPrev < Math.abs(minor)) {
        minor = distanceToPrev
        rounded = this.stepDict[counter + 1]
      }

      counter--
    }

    return rounded
  }

  setInput (input) {
    input.connect(this.node)
  }
}
