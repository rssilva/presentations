class Recorder { // eslint-disable-line
  constructor (audioContext, { bufferSize = 4096, channels = 2, makeSound = true } = {}) {
    this.audioContext = audioContext

    this.node = this.audioContext.createScriptProcessor(bufferSize, 2, channels)
    this.totalRecorded = []
    this.partialRecorded = []
    this.makeSound = makeSound
  }

  onAudioProcess (cb, storeTotal) {
    this.node.onaudioprocess = (ev) => {
      this.partialRecorded = []

      const inputData = ev.inputBuffer.getChannelData(0)
      const outputData = ev.outputBuffer.getChannelData(0)

      const length = inputData.length

      for (let sample = 0; sample < length; sample++) {
        if (this.makeSound) {
          outputData[sample] = inputData[sample]
        }

        this.partialRecorded.push(inputData[sample])

        if (storeTotal) {
          this.totalRecorded.push(inputData[sample])
        }
      }

      if (cb) {
        cb(this.partialRecorded)
      }
    }
  }
}
