class Delay { // eslint-disable-line
  constructor ({ audioContext, value = 0.1 }) {
    this.audioContext = audioContext

    const delay = audioContext.createDelay(value)

    delay.delayTime.setValueAtTime(value, audioContext.currentTime)

    const outputGain = audioContext.createGain()
    const inputGain = audioContext.createGain()

    inputGain.connect(delay)
    inputGain.connect(outputGain)
    delay.connect(outputGain)

    this.inputGain = inputGain
    this.node = outputGain
    this.delay = delay
  }

  setValue (value) {
    this.delay.delayTime.setValueAtTime(value, this.audioContext.currentTime)
  }

  setInput (input) {
    input.connect(this.inputGain)
  }
}
