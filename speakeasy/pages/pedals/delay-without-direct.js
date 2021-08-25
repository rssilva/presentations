(function () {

  let audioContext
  let analyser
  
  const canvasCtx = document.getElementById('analyser-without-direct').getContext('2d')
  
  canvasCtx.canvas.width = window.innerWidth
  canvasCtx.canvas.height = window.innerHeight * 0.9
  
  const start = () => {
    audioContext = new AudioContext()
    const pedalsUtils = new PedalsUtils()
  
    analyser = new modules.Analyser(audioContext, canvasCtx)
  
    pedalsUtils.getUserMedia(connectNodes)
  }

  let stop
  
  const connectNodes = (stream) => {
    const audioInput = audioContext.createMediaStreamSource(stream)
    const delay = audioContext.createDelay(3)
    delay.delayTime.setValueAtTime(3, audioContext.currentTime)
  
    analyser.drawTime()
    analyser.drawFrequency()
    analyser.start()
  
    audioInput.connect(delay)
    // audioInput.connect(analyser.node)
    delay.connect(analyser.node)
  
    analyser.node.connect(audioContext.destination)

    stop = () => {
      delay.disconnect()
      audioInput.disconnect()
      analyser.stop()
      analyser.clear()
    }
  }
  
  document.querySelector('.start-without-direct').addEventListener('click', () => {
    start()
  })
  document.querySelector('.stop-without-direct').addEventListener('click', () => {
    stop()
  })
})()
