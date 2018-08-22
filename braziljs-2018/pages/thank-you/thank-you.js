const audioContext = new AudioContext()
const imageBarsSkin = new ImageBars(document.getElementById('image-canvas').getContext('2d')) // eslint-disable-line

imageBarsSkin.loadImage('../../assets/images/ziggy-drinking.jpg')

const analyser = new modules.Analyser(audioContext, document.getElementById('analyser').getContext('2d'), {
  skin: imageBarsSkin
})
const audioUtils = new modules.AudioUtils(audioContext)

const init = (stream) => {
  const audioInput = audioContext.createMediaStreamSource(stream)

  audioInput.connect(analyser.node)
  // analyser.node.connect(audioContext.destination)
  analyser.start()
}

audioUtils.getUserMedia(init)
