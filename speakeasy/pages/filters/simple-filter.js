(function () {
  // const audioContext = new AudioContext()
  const audioUtils = new modules.AudioUtils(audioContext)
  const select = document.querySelector('#filter-selector')
  const frequencyRange = document.querySelector('#frequency-range')
  const currentFrequency = document.querySelector('#current-frequency')
  const canvasCtx = document.getElementById('analyser-filters').getContext('2d')
  
  canvasCtx.canvas.width = window.innerWidth
  
  let sourceNode = null
  let filter = null
  let analyser = getAnalyser()
  
  select.addEventListener('change', () => {
    disconnect(sourceNode)
    play(audioContext, sourceNode)
  })
  
  frequencyRange.addEventListener('change', () => {
    currentFrequency.value = frequencyRange.value
    disconnect(sourceNode)
    play(audioContext, sourceNode)
  })
  
  const startSong = () => {
    audioUtils.loadSound('../../assets/musics/magic.mp3', audioContext)
      .then((buffer) => {
        sourceNode = getSourceNode(audioContext, buffer)
        play(audioContext, sourceNode)
    
        sourceNode.start(audioContext.currentTime, 75)
      })
  }
  
  const getSourceNode = (audioContext, buffer) => {
    const source = audioContext.createBufferSource()
  
    source.buffer = buffer
    source.looping = true
  
    return source
  }
  
  const getFilter = (audioContext, type, frequency) => {
    const filter = audioContext.createBiquadFilter()
  
    if (type == 'bandpass' || type == 'notch') {
      filter.Q.value = 5
    }
  
    filter.type = type
    filter.frequency.value = frequency
  
    return filter
  }
  
  function getAnalyser() {
    return new modules.Analyser(audioContext, canvasCtx)
  }
  
  const play = (audioContext, sourceNode) => {
    if (filter) {
      filter.disconnect()
      analyser.node.disconnect()
    }
  
    filter = getFilter(audioContext, select.value, frequencyRange.value)
  
    sourceNode.connect(filter)
    filter.connect(analyser.node)
    analyser.node.connect(audioContext.destination)

    analyser.drawTime()
    analyser.drawFrequency()
    analyser.start()
  }

  const stopSong = () => {
    sourceNode.disconnect()
  }
  
  const disconnect = (sourceNode) => {
    sourceNode.disconnect()
    filter.disconnect()

    analyser.stop()
    analyser.clear()
  }

  const start = () => {
    startSong()
    analyser.drawTime()
    analyser.drawFrequency()
    analyser.start()
  }

  const stop = () => {
    analyser.stop()
    analyser.clear()
    analyser.node.disconnect()
    stopSong()
  }

  function bindEvents() {
    document.querySelector('.start-filters').addEventListener('click', start)
    document.querySelector('.stop-filters').addEventListener('click', stop)
  }

  bindEvents()
})()
