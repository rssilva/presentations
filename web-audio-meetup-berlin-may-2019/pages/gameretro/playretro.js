const audioContext = new AudioContext()
const canvasCtx = document.getElementById('analyser').getContext('2d')

canvasCtx.canvas.width = window.innerWidth
canvasCtx.canvas.height = window.innerHeight * 0.8

const analyser = new modules.Analyser(audioContext, canvasCtx)
const RECORDED1 = []

let recorder1 = new Recorder(audioContext, { channels: 1, makeSound: true }) // eslint-disable-line
// let recorder2 = new Recorder(audioContext, { channels: 1, makeSound: true }) // eslint-disable-line

const source = audioContext.createBufferSource()

const init = () => {
  const signal = PARSED_MARIO // eslint-disable-line
  // const signal = SAMPLE_MARIO // eslint-disable-line

  const buffer = audioContext.createBuffer(1, signal.length, audioContext.sampleRate)
  const data1 = buffer.getChannelData(0)

  for (let i = 0; i < signal.length; i += 1) {
    data1[i] = signal[i]
  }

  source.buffer = buffer
  source.looping = false

  recorder1.onAudioProcess((data) => {
    RECORDED1.push(...data)
  })

  const filter = audioContext.createBiquadFilter()
  filter.type = 'lowpass'
  // console.log(filter)
  // filter.frequency.value = 100
  filter.frequency.setValueAtTime(5000, audioContext.currentTime)

  // source.connect(analyser.node)
  // source.connect(filter)
  // filter.connect(analyser.node)
  source.connect(recorder1.node)
  // filter.connect(recorder1.node)
  recorder1.node.connect(analyser.node)
  analyser.node.connect(audioContext.destination)

  analyser.start()

  source.start(audioContext.currentTime)

  source.onended = onEnded

  // stops song 1 second after starts, this will trigger 'onended' callback
  // source.stop(audioContext.currentTime + 2)
}

const onEnded = () => {
  recorder1.node.disconnect()
  source.disconnect()
  analyser.node.disconnect()
  // delay.disconnect()
  // console.log(RECORDED1.slice(RECORDED1.length - 2000))
  // window.localStorage.setItem('recorded', RECORDED1)
}

init()
