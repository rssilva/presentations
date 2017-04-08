const audioContext = new AudioContext()
const canvas = document.getElementById('canvas')
const canvasCtx = canvas.getContext('2d')

const analyser = startAnalyser(audioContext, canvasCtx)

const playTune = (freq = 200) => {
  const osc = audioContext.createOscillator()
  osc.frequency.value = freq
  osc.start()
  osc.connect(analyser)
  analyser.connect(audioContext.destination)
  osc.stop(audioContext.currentTime + 0.1)
}

const kick = (type = 'sine', freq = 120) => {
  const osc = audioContext.createOscillator()
  const gainOsc = audioContext.createGain()

  osc.type = type

  const endTime = audioContext.currentTime + 0.5

  gainOsc.gain.setValueAtTime(1, audioContext.currentTime)
  gainOsc.gain.exponentialRampToValueAtTime(0.0001, endTime)

  osc.frequency.setValueAtTime(freq, audioContext.currentTime)
  osc.frequency.exponentialRampToValueAtTime(0.0001, endTime)

  osc.connect(gainOsc)
  gainOsc.connect(analyser)
  analyser.connect(audioContext.destination)

  osc.start(audioContext.currentTime)

  osc.stop(audioContext.currentTime + 0.5)
}

function noise() {
  const node = audioContext.createBufferSource()
  const buffer = audioContext.createBuffer(1, 4096, audioContext.sampleRate)
  const data = buffer.getChannelData(0)
  const gainOsc = audioContext.createGain()

  for (var i = 0; i < 4096; i++) {
    data[i] = Math.random() / 2
  }

  gainOsc.gain.exponentialRampToValueAtTime(0.0001, audioContext.currentTime + 0.5)

  node.buffer = buffer

  node.start(audioContext.currentTime)
  node.stop(audioContext.currentTime + 1)
  node.connect(gainOsc)

  gainOsc.connect(analyser)
  analyser.connect(audioContext.destination)
}

window.addEventListener('keyup', (ev) => {
  // console.log(ev.keyCode)
  if (ev.keyCode == 65) {
    kick('sine', 200)
  }

  if (ev.keyCode == 83) {
    // kick('sine', 200)
    playTune(1500)
  }

  if (ev.keyCode == 68) {
    // kick('triangle', '')
    noise()
  }
})
