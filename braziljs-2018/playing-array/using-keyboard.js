const audioContext = new AudioContext()
const SAMPLE_RATE = 8000
const duration = 0.3
const increment = 1 / SAMPLE_RATE

const analyser = new modules.Analyser(audioContext, document.getElementById('canvas').getContext('2d'))
const audioUtils = new modules.AudioUtils()

const sin1 = []
const sin2 = []
const kick = []
let random = []

for (let t = 0; t < duration - increment; t += increment) {
  const value1 = Math.sin(6.28 * 300 * t)
  const value2 = Math.sin(6.28 * 600 * t)
  const kickValue = -Math.log(t * 2) * Math.sin(6.28 * 150 * t)
  const randomValue = 0.5 - (Math.random() / 2)

  sin1.push(value1)
  sin2.push(value2)
  kick.push(kickValue)
  random.push(randomValue)
}

random = random.slice(0, random.length / 4)

let node = {}

window.addEventListener('keyup', (ev) => {
  const { keyCode } = ev
  play(keyCode)
})

const play = (code) => {
  if (node.disconnect) {
    node.disconnect()
  }
  console.log(code)
  if (code == 65) {
    node = audioUtils.playSignal({
      signal: sin1,
      audioContext,
      sampleRate: SAMPLE_RATE
    })
  }

  if (code == 68) {
    node = audioUtils.playSignal({
      signal: kick,
      audioContext,
      sampleRate: SAMPLE_RATE
    })
  }

  if (code == 83) {
    node = audioUtils.playSignal({
      signal: sin2,
      audioContext,
      sampleRate: SAMPLE_RATE
    })
  }

  if (code == 70) {
    node = audioUtils.playSignal({
      signal: random,
      audioContext,
      sampleRate: SAMPLE_RATE
    })
  }

  if (node.connect) {
    node.connect(analyser)
  }
}
