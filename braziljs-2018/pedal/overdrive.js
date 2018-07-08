var context = new (window.AudioContext || window.webkitAudioContext)()
var inputBuffer, outputBuffer, inputData, outputData0, outputData1

var init = function () {
  if (!navigator.getUserMedia) {
    navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia
  }

  if (navigator.getUserMedia) {
    navigator.getUserMedia({ audio: true }, success, function (e) {
      console.log('error')
    })
  } else {
    console.log('getUserMedia not supported in this browser.')
  }

  function success (stream) {
    connectNodes(stream)
  }
}

var connectNodes = function (stream) {
  var audioInput = context.createMediaStreamSource(stream)

  var bufferSize = 512
  var processor = context.createScriptProcessor(bufferSize, 2, 2)
  processor.onaudioprocess = onAudioProcess

  audioInput.connect(processor)

  processor.connect(context.destination)
}

var clipValue = 0.2

var onAudioProcess = function (ev) {
  inputBuffer = ev.inputBuffer

  outputBuffer = ev.outputBuffer

  inputData = inputBuffer.getChannelData(0)

  outputData0 = outputBuffer.getChannelData(0)
  outputData1 = outputBuffer.getChannelData(1)

  for (var sample = 0, len = inputData.length; sample < len; sample++) {
    // const result = overdrive(inputData[sample])
    outputData0[sample] = inputData[sample]
    // outputData1[sample] = result
    // current = inputData[sample]
    // recorded.push(current)
    // outputData0[sample] = 50*overdrive(inputData[sample])
  }
}

var overdrive = function (value) {
  if (Math.abs(value) > clipValue) {
    value = clipSignal(value)
  }

  return value
}

var clipSignal = function (value) {
  if (value > 0) {
    value = clipValue
  } else {
    value = -clipValue
  }

  return value
}

init()
