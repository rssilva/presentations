const audioContext = new AudioContext()
const SAMPLE_RATE = audioContext.sampleRate
const audioUtils = new modules.AudioUtils(audioContext)
const canvasCtx = document.getElementById('analyser').getContext('2d')
const canvasUtils = new modules.CanvasUtils()

canvasCtx.canvas.width = window.innerWidth
canvasCtx.canvas.height = window.innerHeight * 0.7

const skin = new FadeImageSkin({
  imageCanvasCtx: document.getElementById('image-canvas-ctx').getContext('2d'),
  canvasUtils,
  image: '../../assets/images/david-bowie-low-small100x100.jpg'
})

const analyser = new modules.Analyser(audioContext, canvasCtx, { skin, fftSize: 4096 })

const soundToImage = document.getElementById('sound-to-image')
const soundToImageContext = soundToImage.getContext('2d')

const filteredImage = document.getElementById('filtered-image')
const filteredImageContext = filteredImage.getContext('2d')

const RECORDED = []
let processorNode

const start = () => {
  audioUtils
    .loadSound('../../assets/musics/rebel-rebel.mp3', audioContext)
    .then((buffer) => {
      processorNode = audioContext.createScriptProcessor(4096, 2, 2)
      const source = audioContext.createBufferSource()

      source.buffer = buffer
      source.looping = false

      processorNode.onaudioprocess = (ev) => {
        const inputData1 = ev.inputBuffer.getChannelData(0)
        // const inputData2 = ev.inputBuffer.getChannelData(1)
        const outputData1 = ev.outputBuffer.getChannelData(0)
        const outputData2 = ev.outputBuffer.getChannelData(1)

        const length = inputData1.length

        for (let sample = 0; sample < length; sample++) {
          outputData1[sample] = inputData1[sample]
          outputData2[sample] = inputData1[sample]
          RECORDED.push(inputData1[sample])
        }
      }

      source.connect(processorNode)
      source.connect(analyser.node)
      processorNode.connect(audioContext.destination)

      const OFFSET = 60

      analyser.start()

      source.start(audioContext.currentTime)

      const duration = (soundToImageContext.canvas.width * soundToImageContext.canvas.height * 4) / SAMPLE_RATE
      console.log(duration)
      source.onended = onEnded

      source.stop(audioContext.currentTime + Math.round(duration))
    })
}

const onEnded = () => {
  processorNode.disconnect()

  const soundToImageParsed = []

  RECORDED.forEach((value) => {
    soundToImageParsed.push((value + 1) * 255 / 2)
  })

  // there is a problem with opacity here... because it used to be setted always to 255
  canvasUtils.plotArray(soundToImageParsed, soundToImageContext, true)

  LenaJS.filterImage(filteredImage, LenaJS['lowpass3'], soundToImage)

  const { width, height } = filteredImageContext.canvas
  const imageInfo = filteredImageContext.getImageData(0, 0, width, height)

  const filteredImageToSound = []

  imageInfo.data.forEach((value, index) => {
    const parsed = (value - 127.5) / 127.5

    filteredImageToSound.push(parsed)
  })

  for (let i = 3; i < filteredImageToSound.length; i += 4) {
    filteredImageToSound[i] = (filteredImageToSound[i - 1] + filteredImageToSound[i + 1]) / 2
  }

  const recordedToPlot = RECORDED.slice(500, 550)
  const imageToSoundToPlot = filteredImageToSound.splice(500, 550)
  const axis = []

  recordedToPlot.forEach((v, i) => axis.push(i))

  // plotGraph({
  //   signals: [
  //     recordedToPlot,
  //     imageToSoundToPlot
  //   ],
  //   axis,
  //   context: document.getElementById('comparison').getContext('2d'),
  //   suggestedMin: -1,
  //   suggestedMax: 1,
  //   colors: ['red', 'orange']
  // })

  setTimeout(() => {
    // const node = audioUtils.playSignal({ signal: filteredImageToSound, sampleRate: SAMPLE_RATE })
    // node.connect(audioContext.destination)
  }, 1000)
}

document.getElementById('play-button').addEventListener('click', start)
