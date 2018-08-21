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
  // proportion = Math.round(AVG / MAX * 255)

  // if (c % 100 == 0) {
  //   console.log(rocketData)
  // }

  // c++

  // light.attributes.color.value = `rgb(${proportion}, ${proportion}, ${proportion})`
  light.attributes.intensity.value = Math.pow(0.5 + average / MAX, 2)
  // light.attributes.intensity.value = 2 * average / MAX + 2
}

setInterval(() => {
  currentTime = new Date().getTime()
  deltaTime = currentTime - previousTime
  // previousTime = currentTime

  setRocketPosition()
  // setCameraPosition()
}, 100)

const setCameraPosition = () => {
  const { previous, speed } = cameraData

  const currentZ = cameraData.z

  cameraData.z = previous.z + speed.z * deltaTime / 1000
  // cameraData.y += previous.y + speed.y * deltaTime
  // cameraData.z += previous.z + speed.z * deltaTime

  previous.z = currentZ

  if (c % 100 == 0) {
    // console.log(cameraData)
  }

  c++

  cameraWrapper.object3D.position.set(cameraData.x, cameraData.y, cameraData.z)
}

const setRocketPosition = () => {
  const { previous, speed } = rocketData

  const currentZ = rocketData.z

  rocketData.z = previous.z + speed.z * deltaTime / 1000
  // rocketData.y += previous.y + speed.y * deltaTime
  // rocketData.z += previous.z + speed.z * deltaTime

  previous.z = currentZ

  if (c % 100 == 0) {
    // console.log(rocketData)
  }

  c++

  rocket.object3D.position.set(rocketData.x, rocketData.y, rocketData.z)
}

console.clear()
load()
