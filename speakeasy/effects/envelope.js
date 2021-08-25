class Envelope { // eslint-disable-line
  constructor ({ audioContext, attack = 0.2, sustain = 0.5, release = 0.3 }) {
    this.attack = attack
    this.sustain = sustain
    this.release = release
    this.audioContext = audioContext

    const gain = audioContext.createGain()

    gain.gain.setValueAtTime(0, audioContext.currentTime)

    this.node = gain
  }

  run () {
    const attackTime = this.audioContext.currentTime + this.attack

    // this.node.gain.exponentialRampToValueAtTime(0.9, attackTime)
    // this.node.gain.linearRampToValueAtTime(0.8, attackTime)
    this.node.gain.linearRampToValueAtTime(1, attackTime)

    setTimeout(() => {
      this.node.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + this.release)
    }, (this.attack + this.sustain) * 1000)
  }

  rampUp () {
    const attackTime = this.audioContext.currentTime + this.attack

    this.node.gain.linearRampToValueAtTime(1, attackTime)
  }

  rampDown () {
    this.node.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + this.release)
  }

  setInput (input) {
    input.connect(this.node)
  }
}
