const audioContext = new AudioContext()
const canvasCtx = document.getElementById('analyser').getContext('2d')
const pedalsUtils = new PedalsUtils()

canvasCtx.canvas.width = window.innerWidth
canvasCtx.canvas.height = window.innerHeight

const analyser = new modules.Analyser(audioContext, canvasCtx)

const connectNodes = (stream) => {
  const audioInput = audioContext.createMediaStreamSource(stream)
  const delay = audioContext.createDelay(3)
  delay.delayTime.setValueAtTime(3, audioContext.currentTime)

  analyser.start()

  audioInput.connect(delay)
  // audioInput.connect(analyser.node)
  delay.connect(analyser.node)

  analyser.node.connect(audioContext.destination)

  bindEvents()
}

const bindEvents = () => {
  const delayValue = document.querySelector('.delay-range-value')
  // document.querySelector('.delay-range').addEventListener('change', (e) => {
  //   const value = e.target.value
  //   delayValue.value = value
  //   delay1.setValue(value)
  // })
}

pedalsUtils.getUserMedia(connectNodes)
