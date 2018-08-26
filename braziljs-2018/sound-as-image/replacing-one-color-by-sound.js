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
// let processorNode

let recorder1 = new Recorder(audioContext, { channels: 1, makeSound: false }) // eslint-disable-line

const init = (splitted) => {
  audioUtils
    .loadSound('../assets/musics/sound-and-vision.mp3', audioContext)
    .then((buffer) => {
      // processorNode = audioContext.createScriptProcessor(4096, 2, 2)
      const source = audioContext.createBufferSource()

      source.buffer = buffer
      source.looping = false

      recorder1.onAudioProcess((data) => {
        RECORDED.push(...data)
      })

      source.connect(recorder1.node)
      source.connect(analyser.node)
      recorder1.node.connect(audioContext.destination)

      const OFFSET = 60

      source.start(audioContext.currentTime, OFFSET)

      const duration = (soundToImageContext.canvas.width * soundToImageContext.canvas.height * 2) / SAMPLE_RATE
      console.log(duration)
      source.onended = () => {
        onEnded(splitted)
      }

      source.stop(audioContext.currentTime + Math.round(duration))
    })
}

const onEnded = (splittedImage) => {
  recorder1.node.disconnect()

  // const parsedColor = audioUtils.parseToImage(RECORDED.splice(0, splittedImage.red.length))
  const final = []
  // const blueParsed = audioUtils.parseToImage(RECORDED.splice(splittedImage.red.length))

  splittedImage.red.forEach((val, i) => {
    final[i] = RECORDED[i] * val
  })

  const finalParsed = audioUtils.parseToImage(final)

  // there is a problem with opacity here... because it used to be setted always to 255
  splittedImage.red = finalParsed
  // splittedImage.blue = finalParsed

  const mounted = canvasUtils.mountRGB(splittedImage)

  canvasUtils.plotArray(mounted, soundToImageContext, false)

  // LenaJS.filterImage(filteredImage, LenaJS['highpass'], soundToImage)

  // const { width, height } = filteredImageContext.canvas
  // const imageInfo = filteredImageContext.getImageData(0, 0, width, height)
  // const splittedAfterFilter = canvasUtils.splitRGB(imageInfo.data)

  // const filteredImageToSound = []

  // splittedAfterFilter.red.forEach((value, index) => {
  //   const parsed = (value - 127.5) / 127.5

  //   filteredImageToSound.push(parsed)
  // })

  // for (let i = 3; i < filteredImageToSound.length; i += 4) {
  //   filteredImageToSound[i] = (filteredImageToSound[i - 1] + filteredImageToSound[i + 1]) / 2
  // }

  // const recordedToPlot = RECORDED.slice(0, 550)
  // const imageToSoundToPlot = filteredImageToSound.splice(0, 550)
  // const axis = []

  // recordedToPlot.forEach((v, i) => axis.push(i))

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

  // const node = audioUtils.playSignal({ signal: filteredImageToSound, sampleRate: SAMPLE_RATE })
  // node.connect(audioContext.destination)
  setTimeout(() => {
  }, 1000)
}

const loadImage = () => {
  const baseImage = new Image()
  baseImage.src = '../assets/images/david-bowie-low-small.jpg'
  const context1 = document.getElementById('base-image').getContext('2d')

  baseImage.onload = () => {
    const { width, height } = context1.canvas

    context1.drawImage(baseImage, 0, 0, width, height)
    const imageInfo = context1.getImageData(0, 0, width, height)

    const splitted = canvasUtils.splitRGB(imageInfo.data)

    console.log(splitted)
    init(splitted)
  }
}

loadImage()
