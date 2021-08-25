(function () {
  let analyser
  const canvasCtx = document.getElementById('analyser-reverb').getContext('2d')
  
  canvasCtx.canvas.width = window.innerWidth
  canvasCtx.canvas.height = window.innerHeight
  
  const start = () => {
    const pedalsUtils = new PedalsUtils()
  
    analyser = new modules.Analyser(audioContext, canvasCtx)
  
    pedalsUtils.getUserMedia(connectNodes)
  }

  let stop
  
  const connectNodes = (stream) => {
    const audioInput = audioContext.createMediaStreamSource(stream)
  
    let convolver = new Convolver({ audioContext })
  
    convolver.loadFile('../../assets/pedals/hall-reverb.ogg')
  
    analyser.drawTime()
    analyser.drawFrequency()
    analyser.start()
  
    audioInput.connect(convolver.node)
    convolver.node.connect(analyser.node)
    analyser.node.connect(audioContext.destination)

    stop = () => {
      audioInput.disconnect()
      analyser.node.disconnect()
      convolver.node.disconnect()
      analyser.stop()
      analyser.clear()
    }
  
    bindEvents()
  }
  
  const bindEvents = () => {}
  
  document.querySelector('.start-reverb').addEventListener('click', () => {
    start()
  })

  document.querySelector('.stop-reverb').addEventListener('click', () => {
    stop()
  })
})()
