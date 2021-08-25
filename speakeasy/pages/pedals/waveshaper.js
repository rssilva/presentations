(function () {
  let waveshaper
  
  const canvasCtx = document.getElementById('analyser-waveshaper').getContext('2d')
  
  canvasCtx.canvas.width = window.innerWidth
  canvasCtx.canvas.height = window.innerHeight * 0.8
  
  const start = () => {
    const pedalsUtils = new PedalsUtils()
  
    analyser = new modules.Analyser(audioContext, canvasCtx)
  
    pedalsUtils.getUserMedia(connectNodes)
  }

  let stop
  
  const connectNodes = (stream) => {
    const audioInput = audioContext.createMediaStreamSource(stream)
    waveshaper = new WaveShaper({ audioContext })
  
    analyser.drawTime()
    analyser.drawFrequency()
    analyser.start()
    waveshaper.makeDistortionCurve(100)
  
    waveshaper.setInput(audioInput)
  
    waveshaper.node.connect(analyser.node)
    analyser.node.connect(audioContext.destination)

    stop = () => {
      audioInput.disconnect()
      waveshaper.node.disconnect()
      analyser.stop()
      analyser.clear()
    }
  
    bindEvents()
  }
  
  const bindEvents = () => {
    const delayValue = document.querySelector('.distortion-range-value')
  
    document.querySelector('.distortion-range').addEventListener('change', (e) => {
      const value = e.target.value
  
      delayValue.value = value
      waveshaper.makeDistortionCurve(Number(value))
    })
  }
  
  document.querySelector('.start-waveshaper').addEventListener('click', () => {
    start()
  })

  document.querySelector('.stop-waveshaper').addEventListener('click', () => {
    stop()
  })
})()
