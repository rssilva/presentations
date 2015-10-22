var context = new (window.AudioContext || window.webkitAudioContext)();
var startOffset = 0;
var startTime = 0;
var filters = [];
var panel = $('.direction-panel');
var panelWidth = $('.direction-panel').width();
var soundBuffer, source, panelX;

var init = function () {
	bind();
	loadSound();
}

var bind = function () {
	panel.on('mousemove', function (ev) {
		onMouseMove(ev.offsetX, ev.offsetY);
	});
}

var onMouseMove = function (x, y) {
	panelX = (x / panelWidth);
  var y = -y / panel.height();
}

var playBuffer = function (buffer) {
	startTime = context.currentTime;

	source = context.createBufferSource();

	source.buffer = buffer;
	source.loop = true;

	var processor = context.createScriptProcessor(512, 2, 2);
	processor.onaudioprocess = onAudioProcess;

	source.connect(processor);
	processor.connect(context.destination);

	source[source.start ? 'start' : 'noteOn'](0, startOffset % buffer.duration);
}

var onAudioProcess = function (ev) {
  inputBuffer = ev.inputBuffer;

  outputBuffer = ev.outputBuffer;

  inputData = inputBuffer.getChannelData(0);

  outputData0 = outputBuffer.getChannelData(0);
  outputData1 = outputBuffer.getChannelData(1);

  for (var sample = 0, len = inputData.length; sample < len; sample++) {
    outputData0[sample] = (1 - panelX) * inputData[sample];
    outputData1[sample] = panelX * inputData[sample];
  }
}

var pauseBuffer = function () {
	source[source.stop ? 'stop': 'noteOff'](0);
    startOffset += context.currentTime - startTime;
}

var loadSound = function () {
	var request = new XMLHttpRequest();
	request.open("GET", 'dont_bring_me_down.mp3', true);
	request.responseType = "arraybuffer";

	request.onload = function() {
	  setBuffer(request.response)
	}

	request.onerror = function() {
	  console.log('BufferLoader: XHR error');
	}

	request.send();
}

var setBuffer = function (data) {
	context.decodeAudioData(
      	data,
      	onBufferLoad,
		function(error) {
			console.error('decodeAudioData error', error);
		}
  );
}

var onBufferLoad = function (buffer) {
	if (!buffer) {
		console.log('error on file parse')
	}

	if (buffer) {
		console.log('loaded')
		soundBuffer = buffer;
		playBuffer(buffer);
	}
}

init();