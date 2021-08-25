(function () {
  // const audioContext = new AudioContext()
  const SAMPLE_RATE = audioContext.sampleRate
  const canvasCtx = document.getElementById('canvas-playing-color').getContext('2d')
  canvasCtx.canvas.width = window.innerWidth

  const aladdinSkin = new Aladdin(true) // eslint-disable-line

  const analyser = new modules.Analyser(audioContext, canvasCtx, {
    skin: aladdinSkin
  })

  aladdinSkin.setLightning()

  const audioUtils = new modules.AudioUtils(audioContext)
  const canvasUtils = new modules.CanvasUtils()

  const canvas2 = document.getElementById('canvas-playing-color-original')
  const context = canvas2.getContext('2d')
  let node
  let parsed

  const baseImage = new Image()
  baseImage.src = '../../assets/images/david-bowie-low.jpg'

  baseImage.onload = () => {
    const { width, height } = context.canvas

    context.drawImage(baseImage, 0, 0, width, height)
    const imageInfo = context.getImageData(0, 0, width, height)

    const splitted = canvasUtils.splitRGB(imageInfo.data)

    parsed = splitted.red.map((value) => {
      return (value - 127.5) / 127.5
    })
  }

  const start = () => {
    analyser.drawTime()
    analyser.drawFrequency()
    analyser.start()
  }

  const play = () => {
    node = audioUtils.playSignal({ signal: parsed, sampleRate: SAMPLE_RATE })

    node.connect(analyser.node)
  }

  const stop = () => {
    if (node && node.disconnect) {
      node.disconnect()
    }

    analyser.stop()
    analyser.clear()
  }

  const bindEvents = () => {
    $('#start-color-button').on('click', start)
    $('#play-color-button').on('click', play)
    $('#stop-color-button').on('click', stop)
  }

  bindEvents()

})()
