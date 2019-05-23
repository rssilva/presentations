class DelayRetro { // eslint-disable-line
  constructor ({ audioContext, value = 0.1, gain = 0.9 }) {
    this.audioContext = audioContext
    const delay = audioContext.createDelay()

    delay.delayTime.setValueAtTime(value, audioContext.currentTime)

    const inputGain = audioContext.createGain()
    const feedbackGain = audioContext.createGain()

    feedbackGain.gain.value = gain

    this.inputGain = inputGain
    this.feedbackGain = feedbackGain
    this.node = feedbackGain
    this.delay = delay

    inputGain.connect(delay)
    delay.connect(feedbackGain)
    feedbackGain.connect(delay)
    // gainNode.connect(delay)
  }

  setValue (value) {
    this.feedbackGain.gain.setValueAtTime(value, this.audioContext.currentTime)
  }

  setGain (value) {
    this.delay.delayTime.setValueAtTime(value, this.audioContext.currentTime)
  }

  setInput (input) {
    input.connect(this.inputGain)
  }
}
