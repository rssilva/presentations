// var context = new (window.AudioContext || window.webkitAudioContext)();
var startOffset = 0;
var startTime = 0;
var filters = [];
var audioInput;
var sample, analyser, soundBuffer, source;

var init = function () {
  if (!navigator.getUserMedia) {
      navigator.getUserMedia = navigator.getUserMedia || 
      	navigator.webkitGetUserMedia ||
		    navigator.mozGetUserMedia ||
		    navigator.msGetUserMedia;
  }

  if (navigator.getUserMedia) {
      navigator.getUserMedia({audio:true}, connectNodes, function(e) {
          console.log('error')
      });

  } else {
      console.log('getUserMedia not supported in this browser.');
  }

}

var connectNodes = function (stream) {
  sample = new VisualizerSample();
  analyser = sample.getAnalyser();
  sample.draw2();

	audioInput = context.createMediaStreamSource(stream);

	var bufferSize = 512;

	// var recorder = context.createScriptProcessor(bufferSize, 2, 2);
	// recorder.onaudioprocess = onAudioProcess;

	// audioInput.connect(recorder);
	// recorder.connect(context.destination);

  setInterval(function () {
    console.log(window.MAX_FREQ)
  }, 1000)

  audioInput.connect(analyser);

  audioInput.connect(context.destination)
}

var connectFilter = function () {
  audioInput.disconnect();

  audioInput.connect(analyser);

  var filter = context.createBiquadFilter();
  filter.type = 'bandpass';
  filter.frequency.value = window.MAX_FREQ;

  audioInput.connect(filter);
  filter.connect(context.destination);

  return filter;
}

var inputBuffer, outputBuffer, inputData, outputData, compressed, decompressed;

var counter = 0;
var total = [];
var time1 = new Date().getTime();

var onAudioProcess = function (ev) {
  inputBuffer = ev.inputBuffer;

  outputBuffer = ev.outputBuffer;

  inputData = inputBuffer.getChannelData(0);
  outputData = outputBuffer.getChannelData(1);

  for (var sample = 0; sample < inputData.length; sample++) {
    outputData[sample] = inputData[sample];
  }

  counter++;
}

init();
