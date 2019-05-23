class ComplexDelay { // eslint-disable-line
  constructor ({ audioContext, value = 0.1 }) {
    const delay1 = audioContext.createDelay()
    const delay2 = audioContext.createDelay()
    // const delay3 = audioContext.createDelay()

    delay1.delayTime.setValueAtTime(value, audioContext.currentTime)
    delay2.delayTime.setValueAtTime(value, audioContext.currentTime)

    const outputGain = audioContext.createGain()
    const inputGain = audioContext.createGain()

    outputGain.gain.value = 1

    this.inputGain = inputGain

    inputGain.connect(delay1)
    inputGain.connect(delay2)
    delay1.connect(outputGain)
    delay2.connect(outputGain)

    this.node = outputGain
  }

  setInput (input) {
    input.connect(this.inputGain)
  }
}
