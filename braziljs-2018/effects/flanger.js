// thanks to @Sambego https://github.com/Sambego/audio-effects

class Flanger { // eslint-disable-line
  constructor ({ audioContext, delayMaxTime = 1, delayTime = 0.005, feedbackValue = 0.5, gainValue = 0.002, speedValue = 0.25 }) {
    this.audioContext = audioContext

    const inputGain = audioContext.createGain()
    const gain = audioContext.createGain()
    const wetGain = audioContext.createGain()
    const delay = audioContext.createDelay(delayMaxTime)
    const feedback = audioContext.createGain()
    const oscillator = audioContext.createOscillator()

    this.delay = delay
    this.feedback = feedback
    this.oscillator = oscillator
    this.gain = gain

    delay.delayTime.setValueAtTime(delayTime, audioContext.currentTime)
    feedback.gain.setValueAtTime(feedbackValue, audioContext.currentTime)
    gain.gain.setValueAtTime(gainValue, audioContext.currentTime)

    oscillator.connect(gain)

    this.inputGain = inputGain

    inputGain.connect(delay)
    inputGain.connect(wetGain)
    gain.connect(delay.delayTime)
    delay.connect(wetGain)
    delay.connect(feedback)
    feedback.connect(inputGain)

    oscillator.type = 'sine'
    oscillator.frequency.value = speedValue
    oscillator.start()

    this.node = wetGain
  }

  setInput (input) {
    input.connect(this.inputGain)
  }

  setDelay (value) {
    this.delay.delayTime.setValueAtTime(value, this.audioContext.currentTime)
  }

  setFeedback (value) {
    this.feedback.gain.setValueAtTime(value, this.audioContext.currentTime)
  }

  setSpeed (value) {
    this.oscillator.frequency.setValueAtTime(value, this.audioContext.currentTime)
  }

  setDepth (value) {
    this.gain.gain.setValueAtTime(value, this.audioContext.currentTime)
  }
}
