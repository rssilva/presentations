(function () {

  let analyser
  let flanger
  
  const canvasCtx = document.getElementById('analyser-flanger').getContext('2d')
  
  canvasCtx.canvas.width = window.innerWidth
  canvasCtx.canvas.height = window.innerHeight * 0.7

  let stop
  
  const start = () => {
    const pedalsUtils = new PedalsUtils()
  
    analyser = new modules.Analyser(audioContext, canvasCtx)
  
    pedalsUtils.getUserMedia(connectNodes)
  }
  
  const connectNodes = (stream) => {
    const audioInput = audioContext.createMediaStreamSource(stream)
    flanger = new Flanger({ audioContext })
  
    analyser.drawTime()
    analyser.drawFrequency()
    analyser.start()
  
    // audioInput.connect(flanger.node)
    flanger.setInput(audioInput)
    flanger.node.connect(analyser.node)
  
    analyser.node.connect(audioContext.destination)

    stop = () => {
      audioInput.disconnect()
      analyser.node.disconnect()
      flanger.node.disconnect()
      analyser.stop()
      analyser.clear()
    }
  
    bindEvents()
  }
  
  const bindEvents = () => {
    const delayValue = document.querySelector('.flanger-delay-range-value')
    const feedbackValue = document.querySelector('.flanger-feedback-range-value')
    const speedValue = document.querySelector('.flanger-speed-range-value')
    const depthValue = document.querySelector('.flanger-depth-range-value')
  
    document.querySelector('.flanger-delay-range').addEventListener('change', (e) => {
      const value = e.target.value
  
      delayValue.value = value
      flanger.setDelay(value)
    })
  
    document.querySelector('.flanger-feedback-range').addEventListener('change', (e) => {
      const value = e.target.value
  
      feedbackValue.value = value
      flanger.setFeedback(value)
    })
  
    document.querySelector('.flanger-speed-range').addEventListener('change', (e) => {
      const value = e.target.value
  
      speedValue.value = value
      flanger.setSpeed(value)
    })
  
    document.querySelector('.flanger-depth-range').addEventListener('change', (e) => {
      const value = e.target.value
  
      depthValue.value = value
      flanger.setDepth(value)
    })
  }
  
  document.querySelector('.flanger-start').addEventListener('click', () => {
    start()
  })

  document.querySelector('.flanger-stop').addEventListener('click', () => {
    stop()
  })
})()
