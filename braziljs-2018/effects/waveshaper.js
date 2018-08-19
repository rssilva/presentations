class WaveShaper { // eslint-disable-line
  constructor ({ audioContext }) {
    this.audioContext = audioContext

    const node = audioContext.createWaveShaper()

    this.node = node
  }

  makeDistortionCurve (amount) {
    const k = amount
    const nSamples = 44100
    const curve = new Float32Array(nSamples)
    const deg = Math.PI / 180
    let x

    for (let i = 0; i < nSamples; ++i) {
      x = i * 2 / nSamples - 1
      curve[i] = (3 + k) * x * 20 * deg / (Math.PI + k * Math.abs(x))
    }

    this.node.curve = curve

    return curve
  }

  setInput (input) {
    input.connect(this.node)
  }
}
