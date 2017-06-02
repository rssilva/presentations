'use strict'

const canvasOrigin = document.getElementById('canvas')
const canvasResult = document.getElementById('canvas-result')

const kanvasOrigin = Kanvas.new()
const kanvasResult = Kanvas.new()

kanvasOrigin.init(canvasOrigin)
kanvasResult.init(canvasResult)

const baseImage = new Image()
baseImage.src = 'lena.jpg'
var time1 = new Date()
baseImage.onload = () => {
  kanvasOrigin.context.drawImage(baseImage, 0, 0, kanvasOrigin.context.canvas.width, kanvasOrigin.context.canvas.height)

  const splitted = kanvasOrigin.splitRGB(kanvasOrigin.getImageData())

  const canvasGraphs = document.getElementById('canvas-graphs')
  const ctx = canvasGraphs.getContext('2d')
  const { width } = ctx.canvas
  const xAxis = evaluateXAxis(0.1, 20, 0.01)

  const sliceSize = width / (xAxis.length - 1)

  const points = []
  const colors = ['#FF0000', '#00FF00', '#0000FF']

  let max = null
  let min = null

  for (let i = 0; i < splitted.r.length; i++) {
    const r = splitted.r[i]
    const g = splitted.g[i]
    const b = splitted.b[i]

    const values = [
      r,
      g,
      b
    ]

    const x = sliceSize * i

    const currentMax = _.max(values)
    const currentMin = _.min(values)

    max = currentMax > max ? currentMax : max
    min = currentMin < min ? currentMin : min

    points.push({x, values})
  }

  ctx.lineWidth = 1

  plotGraphs(ctx, points, min, max, colors)

  playSignal(splitted.r)
}

const playSignal = (signal) => {
  const audioContext = new AudioContext()
  const node = audioContext.createBufferSource()
  const buffer = audioContext.createBuffer(1, signal.length - 1, audioContext.sampleRate)
  const data = buffer.getChannelData(0)
  const gainOsc = audioContext.createGain()

  const analyserCanvas = document.getElementById('canvas-analyser')
  const canvasCtx = analyserCanvas.getContext('2d')

  const analyser = startAnalyser(audioContext, canvasCtx)

  var processor = audioContext.createScriptProcessor(16384, 2, 2);
	processor.onaudioprocess = onAudioProcess

  const filter = audioContext.createBiquadFilter()
  filter.type = 'highpass'
  filter.frequency.value = 10
  // filter.Q.value = 0.2

  for (var i = 0; i < signal.length; i++) {
    data[i] = signal[i]
  }

  node.buffer = buffer
  node.connect(filter)
  // node.connect(audioContext.destination)
  filter.connect(processor)
  processor.connect(audioContext.destination)

  node.start(audioContext.currentTime)
  // node.stop(audioContext.currentTime + 1)

  // plotFiltered(signal)
}

var RECORDED = []

var onAudioProcess = function (ev) {
  var inputBuffer = ev.inputBuffer;
  var inputData = inputBuffer.getChannelData(0);

  for (var sample = 0, len = inputData.length; sample < len; sample++) {
    RECORDED.push( inputData[sample] );
  }
}

const plotFiltered = (signal) => {
  const { width, height } = kanvasOrigin.context.canvas

  const imgData = kanvasOrigin.getImageData()
  const dataArr = new Uint8ClampedArray(imgData.data.length);

  for (let i = 0; i < imgData.data.length - 1; i += 4) {
    if (i % 1000 === 0) {
      signal[Math.floor(i/4)]
    }

    dataArr[i] = signal[Math.floor(i/4)]
    dataArr[i + 1] = 0
    dataArr[i + 2] = 100 //imgData.data[i+2]
    dataArr[i + 3] = 255
  }


  imgData.data.set(dataArr)
  kanvasResult.context.putImageData(imgData, 0, 0)
}
