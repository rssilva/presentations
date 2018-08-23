const audioContext = new AudioContext()
const audioUtils = new modules.AudioUtils(audioContext)
let sourceNode = null
let analyser

const load = () => {
  audioUtils.loadSound('../assets/musics/space-oddity.mp3', audioContext)
    .then((buffer) => {
      sourceNode = getSourceNode(audioContext, buffer)

      analyser = new AnalyserRealTime(audioContext, {}, onFrequency)
      analyser.start()

      sourceNode.connect(analyser.node)
      analyser.node.connect(audioContext.destination)

      sourceNode.start(audioContext.currentTime)
    })
}

const getSourceNode = (audioContext, buffer) => {
  const source = audioContext.createBufferSource()

  source.buffer = buffer
  source.looping = true

  return source
}

let AVG = 0
const MAX = 110
const START_TIME = new Date().getTime()
let currentTime = START_TIME
let previousTime = START_TIME

const light = document.getElementById('light')
const rocket = document.getElementById('rocket')
// const camera = document.getElementById('camera')
const cameraWrapper = document.getElementById('camera-wrapper')

let deltaTime = 0
let c = 0
// let proportion

const rocketData = {
  previous: {
    x: 0,
    y: 2,
    z: 0
  },
  x: 0,
  y: 2,
  z: 0,
  speed: {
    x: 0,
    y: 0,
    z: 0.0015
  }
}

const cameraData = {
  previous: {
    x: -12,
    y: 4,
    z: 20
  },
  x: -12,
  y: 4,
  z: 20,
  speed: {
    x: 0,
    y: 0,
    z: 1
  }
}

const onFrequency = (dataArray) => {
  let avg = 0

  dataArray.forEach((value) => {
    avg += value
  })

  AVG = avg / dataArray.length

  setLight(AVG)
}

const setLight = (average) => {
  light.attributes.intensity.value = Math.pow(0.5 + average / MAX, 2) * (ADDITION + 1)
  // light.attributes.intensity.value = 2 * average / MAX + 2
}

let hasMusicChanged = false
let ADDITION = 0

const change = () => {
  if (!hasMusicChanged) {
    // light.attributes.intensity.value = 5
    ADDITION = 5
    light.attributes.color.value = '#FDB813'
  }

  hasMusicChanged = true
}

setInterval(() => {
  currentTime = new Date().getTime()
  deltaTime = currentTime - previousTime
  // previousTime = currentTime

  if (deltaTime > 69400) {
    change()
  }

  setRocketPosition()
}, 100)

const setRocketPosition = () => {
  const { previous, speed } = rocketData

  const currentZ = rocketData.z

  rocketData.z = previous.z + speed.z * deltaTime / 1000
  // rocketData.y += previous.y + speed.y * deltaTime
  // rocketData.z += previous.z + speed.z * deltaTime

  previous.z = currentZ

  if (c % 100 == 0) {
    // git.log(rocketData)
  }

  c++

  rocket.object3D.position.set(rocketData.x, rocketData.y, rocketData.z)
}

console.clear()
load()
