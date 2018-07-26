const audioContext = new AudioContext()
const SAMPLE_RATE = audioContext.sampleRate

const analyser = new modules.Analyser(audioContext, document.getElementById('analyser').getContext('2d'))
const audioUtils = new modules.AudioUtils(audioContext)
const canvasUtils = new modules.CanvasUtils()

const soundToImage = document.getElementById('sound-to-image')
const soundToImageContext = soundToImage.getContext('2d')

const filteredImage = document.getElementById('filtered-image')
const filteredImageContext = filteredImage.getContext('2d')

analyser.start()

const RECORDED = []
let processorNode

const init = (splitted) => {
  audioUtils
    .loadSound('../sound-and-vision.mp3', audioContext)
    .then((buffer) => {
      processorNode = audioContext.createScriptProcessor(4096, 2, 2)
      const source = audioContext.createBufferSource()

      source.buffer = buffer
      source.looping = false

      processorNode.onaudioprocess = (ev) => {
        const inputData = ev.inputBuffer.getChannelData(0)
        const outputData = ev.outputBuffer.getChannelData(0)

        const length = inputData.length

        for (let sample = 0; sample < length; sample++) {
          outputData[sample] = inputData[sample]
          RECORDED.push(inputData[sample])
        }
      }

      source.connect(processorNode)
      source.connect(analyser.node)
      processorNode.connect(audioContext.destination)

      const OFFSET = 60

      source.start(audioContext.currentTime, OFFSET)

      const duration = (soundToImageContext.canvas.width * soundToImageContext.canvas.height * 4) / SAMPLE_RATE
      console.log(duration)
      source.onended = () => {
        onEnded(splitted)
      }

      source.stop(audioContext.currentTime + Math.round(duration))
    })
}

const onEnded = (splittedImage) => {
  processorNode.disconnect()

  const soundParsed = []

  RECORDED.forEach((value) => {
    soundParsed.push((value + 1) * 255 / 2)
  })

  // there is a problem with opacity here... because it used to be setted always to 255
  splittedImage.red = soundParsed
  const mounted = canvasUtils.mountRGB(splittedImage)

  canvasUtils.plotArray(mounted, soundToImageContext, false)

  LenaJS.filterImage(filteredImage, LenaJS['highpass'], soundToImage)

  const { width, height } = filteredImageContext.canvas
  const imageInfo = filteredImageContext.getImageData(0, 0, width, height)
  const splittedAfterFilter = canvasUtils.splitRGB(imageInfo.data)

  const filteredImageToSound = []

  splittedAfterFilter.red.forEach((value, index) => {
    const parsed = (value - 127.5) / 127.5

    filteredImageToSound.push(parsed)
  })

  // for (let i = 3; i < filteredImageToSound.length; i += 4) {
  //   filteredImageToSound[i] = (filteredImageToSound[i - 1] + filteredImageToSound[i + 1]) / 2
  // }

  const recordedToPlot = RECORDED.slice(0, 550)
  const imageToSoundToPlot = filteredImageToSound.splice(0, 550)
  const axis = []

  recordedToPlot.forEach((v, i) => axis.push(i))

  plotGraph({
    signals: [
      recordedToPlot,
      imageToSoundToPlot
    ],
    axis,
    context: document.getElementById('comparison').getContext('2d'),
    suggestedMin: -1,
    suggestedMax: 1,
    colors: ['red', 'orange']
  })

  const node = audioUtils.playSignal({ signal: filteredImageToSound, sampleRate: SAMPLE_RATE })
  node.connect(audioContext.destination)
  setTimeout(() => {
  }, 1000)
}

const loadImage = () => {
  const baseImage = new Image()
  baseImage.src = '../david-bowie-low-small.jpg'
  const context1 = document.getElementById('base-image').getContext('2d')

  baseImage.onload = () => {
    const { width, height } = context1.canvas

    context1.drawImage(baseImage, 0, 0, width, height)
    const imageInfo = context1.getImageData(0, 0, width, height)

    const splitted = canvasUtils.splitRGB(imageInfo.data)
    // const green = splitted.green.map((val, index) => {
    //   return 120 + 100 * (Math.sin(index / 1000) + 2 * Math.cos(index))
    // })
    // splitted.green = green

    console.log(splitted)
    init(splitted)
  }
}

loadImage()
