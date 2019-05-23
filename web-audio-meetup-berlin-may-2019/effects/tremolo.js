class Tremolo { // eslint-disable-line
  constructor ({ audioContext, value = 2 }) {
    this.audioContext = audioContext

    const oscillator = audioContext.createOscillator()
    const gain = audioContext.createGain()

    oscillator.frequency.setValueAtTime(value, audioContext.currentTime)
    oscillator.connect(gain)
    oscillator.type = 'sine'

    oscillator.start()

    this.oscillator = oscillator

    this.node = gain
  }

  setValue (value) {
    this.oscillator.frequency.setValueAtTime(value, this.audioContext.currentTime)
  }

  setInput (input) {
    input.connect(this.node)
  }
}
