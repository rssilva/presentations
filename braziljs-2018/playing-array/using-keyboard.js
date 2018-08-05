const audioContext = new AudioContext()
const SAMPLE_RATE = 8000
const duration = 0.5
const increment = 1 / SAMPLE_RATE

const aladdinSkin = new Aladdin() // eslint-disable-line

const analyser = new modules.Analyser(audioContext, document.getElementById('canvas').getContext('2d'), {
  skin: aladdinSkin
})
const audioUtils = new modules.AudioUtils(audioContext)

const sin1 = []
const sin2 = []
const kick1 = []
const kick2 = []
const violin = []
let random = []

let i = 0

for (let t = 0; t < (duration - increment); t += increment) {
  const value1 = Math.sin(6.28 * 300 * t)
  const value2 = Math.sin(6.28 * 600 * t)
  const kickValue1 = Math.exp(-t * 10) * Math.sin(6.28 * 150 * t)
  const kickValue2 = Math.exp(-t * 10) * Math.sin(6.28 * 2000 * t)
  // const kickValue2 = t / (duration) * Math.exp(-t * 10) * Math.sin(6.28 * 2000 * t)
  const randomValue = 0.3 - (Math.random() / 2)

  let y = 0
  let aTotal = 0

  for (let harm = 1; harm <= 7; harm++) {
    let f2 = 400 * harm
    let A = 1 / harm
    aTotal += A
    y += A * Math.sin(f2 * 2 * 3.14 * t)
  }

  violin[i] = y / aTotal
  violin[i] *= (1 - 0.5 * Math.sin(2 * 3.14 * 6 * t)) // Add a low frequency amplitude modulation
  violin[i] *= (1 - Math.exp(-t * 3))

  i++
  // const kickValue1 = Math.pow(v0 * (duration / v0), t / (duration)) * Math.sin(6.28 * 200 * t)
  // const kickValue2 = Math.pow(v0 * (duration / v0), t / (duration)) * Math.sin(6.28 * (2000 - 4000 * t) * t)

  sin1.push(value1)
  sin2.push(value2)
  kick1.push(kickValue1)
  kick2.push(kickValue2)
  random.push(randomValue)
}

random = random.slice(0, random.length / 6)

let node = {}

analyser.start()

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
    node = audioUtils.playSignal({ signal: sin1, sampleRate: SAMPLE_RATE })
  }

  if (code == 68) {
    node = audioUtils.playSignal({ signal: kick1, sampleRate: SAMPLE_RATE })
  }

  if (code == 83) {
    node = audioUtils.playSignal({ signal: sin2, sampleRate: SAMPLE_RATE })
  }

  if (code == 70) {
    node = audioUtils.playSignal({ signal: random, sampleRate: SAMPLE_RATE })
  }

  if (code == 71) {
    node = audioUtils.playSignal({ signal: kick2, sampleRate: SAMPLE_RATE })
  }

  if (code == 72) {
    node = audioUtils.playSignal({ signal: violin, sampleRate: SAMPLE_RATE })
  }

  if (node.connect) {
    node.connect(analyser.node)
  }
}
