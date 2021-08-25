(function () {
  // let audioContext
  let analyser
  let delay1
  
  const canvasCtx = document.getElementById('analyser-delay-direct').getContext('2d')
  
  canvasCtx.canvas.width = window.innerWidth
  canvasCtx.canvas.height = window.innerHeight * 0.9
  
  const start = () => {
    const pedalsUtils = new PedalsUtils()
  
    analyser = new modules.Analyser(audioContext, canvasCtx)
  
    pedalsUtils.getUserMedia(connectNodes)
  }

  let stop
  
  const connectNodes = (stream) => {
    const audioInput = audioContext.createMediaStreamSource(stream)
    delay1 = new Delay({ audioContext, value: 3 })
  
    analyser.drawTime()
    analyser.drawFrequency()
    analyser.start()
  
    audioInput.connect(delay1.inputGain)
    audioInput.connect(analyser.node)
    delay1.node.connect(analyser.node)
  
    audioInput.connect(audioContext.destination)
    analyser.node.connect(audioContext.destination)

    stop = () => {
      audioInput.disconnect()
      analyser.node.disconnect()
      delay1.node.disconnect()
      analyser.stop()
      analyser.clear()
    }
  
    bindEvents()
  }
  
  const bindEvents = () => {
    const delayValue = document.querySelector('.delay-range-value')

    document.querySelector('.delay-range').addEventListener('change', (e) => {
      const value = e.target.value
      delayValue.value = value
      delay1.setValue(value)
    })
  }
  
  document.querySelector('.start-delay-direct').addEventListener('click', () => {
    start()
  })

  document.querySelector('.stop-delay-direct').addEventListener('click', () => {
    stop()
  })
})()
