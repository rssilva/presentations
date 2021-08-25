(function () {
  // const audioContext = new AudioContext()
  const canvasCtx = document.getElementById('analyser-eight-bit').getContext('2d')
  
  canvasCtx.canvas.width = window.innerWidth
  canvasCtx.canvas.height = window.innerHeight * 0.8
  
  let analyser
  const RECORDED1 = []
  
  let recorder1 = new Recorder(audioContext, { channels: 1, makeSound: true }) // eslint-disable-line
  // let recorder2 = new Recorder(audioContext, { channels: 1, makeSound: true }) // eslint-disable-line
  
  const source = audioContext.createBufferSource()

  let stop
  
  const init = () => {
    analyser = new modules.Analyser(audioContext, canvasCtx)
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

    source.connect(recorder1.node)
    // filter.connect(recorder1.node)
    recorder1.node.connect(analyser.node)
    analyser.node.connect(audioContext.destination)
  
    analyser.drawTime()
    analyser.drawFrequency()
    analyser.start()
  
    source.start(audioContext.currentTime)
  
    source.onended = onEnded

    stop = () => {
      source.disconnect()
      recorder1.node.disconnect()
      analyser.node.disconnect()
      analyser.stop()
      analyser.clear()
    }
  
    // stops song 1 second after starts, this will trigger 'onended' callback
    // source.stop(audioContext.currentTime + 2)
  }
  
  const onEnded = () => {
    recorder1.node.disconnect()
    source.disconnect()
    analyser.node.disconnect()
  }

  function bindEvents() {
    document.querySelector('.start-8-bit').addEventListener('click', () => {
      init()
    })

    document.querySelector('.stop-8-bit').addEventListener('click', () => {
      stop()
    })
  }
  
  bindEvents()
})()
