const audioContext = new AudioContext()
const analyser = new modules.Analyser(audioContext, document.getElementById('analyser').getContext('2d'))
const audioUtils = new modules.AudioUtils(audioContext)

const RECORDED1 = []

let recorder1 = new Recorder(audioContext, { channels: 1 }) // eslint-disable-line
let audioInput

const init = (stream) => {
  audioInput = audioContext.createMediaStreamSource(stream)

  const waveshaper = new WaveShaper({ audioContext })
  waveshaper.makeDistortionCurve(400)

  recorder1.onAudioProcess((data) => {
    RECORDED1.push(...data)
  })

  audioInput.connect(recorder1.node)
  recorder1.node.connect(analyser.node)
  analyser.node.connect(audioContext.destination)

  analyser.start()

  // stops song 1 second after starts, this will trigger 'onended' callback
  setTimeout(() => {
    onEnded()
  }, 3000)
}

const onEnded = () => {
  recorder1.node.disconnect()
  audioInput.disconnect()
  analyser.node.disconnect()

  // plotGraph({
  //   signals: [
  //     RECORDED1.slice(0, 2000)
  //   ],
  //   context: document.getElementById('comparison').getContext('2d'),
  //   suggestedMin: -1,
  //   suggestedMax: 1,
  //   colors: ['red', 'orange']
  // })

  $.ajax({
    url: 'http://localhost:3000/clear'
  }).then(() => {
    sendData(RECORDED1)
  })
}

const sendData = (arr, index = 0) => {
  const size = 500
  const slice = arr.slice(index, index + size)

  if (slice.length == 0) {
    $.ajax({
      url: 'http://localhost:3000/end'
    })

    return
  }

  $.ajax({
    method: 'POST',
    dataType: 'json',
    url: 'http://localhost:3000/data',
    data: { slice: slice.toString() }
  }).then(() => {
    index += size
    sendData(arr, index)
  })
}

let counter = 5

const interval = setInterval(() => {
  counter--
  console.log(counter)

  if (!counter) {
    console.log('GOOOOO')
    clearInterval(interval)
    audioUtils.getUserMedia(init)
  }
}, 1000)
