(function () {
  let analyser
  let delay1
  const canvasCtx = document.getElementById('analyser-delay-retro').getContext('2d')

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
    delay1 = new DelayRetro({ audioContext, value: 3 })

    analyser.drawTime()
    analyser.drawFrequency()
    analyser.start()

    // audioInput.connect(delay1.node)
    delay1.setInput(audioInput)
    // audioInput.connect(analyser.node)
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
    const delayValue = document.querySelector('.delay-retro-range-value')
    const gainValue = document.querySelector('.delay-retro-gain-range-value')

    document.querySelector('.delay-retro-range').addEventListener('change', (e) => {
      const value = e.target.value

      console.log(value)

      delayValue.value = value
      delay1.setValue(value)
    })

    document.querySelector('.delay-retro-gain-range').addEventListener('change', (e) => {
      const value = e.target.value

      console.log(value)

      gainValue.value = value
      delay1.setGain(value)
    })
  }

  document.querySelector('.start-delay-retro').addEventListener('click', () => {
    start()
  })

  document.querySelector('.stop-delay-retro').addEventListener('click', () => {
    stop()
  })
  
})()
