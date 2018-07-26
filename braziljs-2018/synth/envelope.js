const audioContext = new AudioContext()
const analyser = new modules.Analyser(audioContext, document.getElementById('analyser').getContext('2d'))
const PRESSED = {}

const NOTES = {
  65: 65.41,
  83: 73.42,
  68: 82.41,
  70: 400
}

const oscillator = audioContext.createOscillator()
oscillator.type = 'sawtooth'

const envelope = new Envelope({ audioContext, attack: 0.3, sustain: 0.4, release: 1 })
const filter = audioContext.createBiquadFilter()
filter.type = 'lowpass'
filter.frequency.value = 500

const init = () => {
  oscillator.connect(filter)
  envelope.setInput(filter)
  envelope.node.connect(analyser.node)
  analyser.node.connect(audioContext.destination)

  analyser.start()

  oscillator.start(audioContext.currentTime)

  bindEvents()
}

const playNote = (keyCode) => {
  const note = NOTES[keyCode]

  if (note) {
    oscillator.frequency.value = note
    envelope.rampUp()
  }
}

const bindEvents = () => {
  window.addEventListener('keydown', (ev) => {
    onDown(ev.keyCode)
  })

  window.addEventListener('keyup', (ev) => {
    onUp(ev.keyCode)
  })
}

const onDown = (keyCode) => {
  console.log(PRESSED)
  if (!PRESSED[keyCode]) {
    playNote(keyCode)
  }

  PRESSED[keyCode] = true
}

const onUp = (keyCode) => {
  if (PRESSED[keyCode]) {
    envelope.rampDown()
  }

  PRESSED[keyCode] = null
}

init()
