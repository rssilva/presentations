var context = new (window.AudioContext || window.webkitAudioContext)();
var startOffset = 0;
var startTime = 0;
var filters = [];
var soundBuffer, source, panelX;

var init = function () {
	loadSound();
}

var playBuffer = function (buffer) {
	startTime = context.currentTime;

	source = context.createBufferSource();

	source.buffer = buffer;
	source.loop = true;

  var delay1 = context.createDelay();
  delay1.delayTime.value = 5;
  
  var splitter = context.createChannelSplitter(2);
  source.connect(splitter);

  var merger = context.createChannelMerger(2);

  var low = createFilter('lowpass', 100);
  var high = createFilter('highpass', 2000);

  splitter.connect(high, 0);
  // splitter.connect(delay1, 0);
  splitter.connect(low, 1);

  high.connect(merger, 0, 1);
  // delay1.connect(merger, 0, 1);
  low.connect(merger, 0, 0);


  merger.connect(context.destination)

	source[source.start ? 'start' : 'noteOn'](0, startOffset % buffer.duration);
}

var createFilter = function (type, freq) {
  var filter = context.createBiquadFilter();
  filter.type = type;
  filter.frequency.value = freq;

  return filter;
}

var pauseBuffer = function () {
	source[source.stop ? 'stop': 'noteOff'](0);
    startOffset += context.currentTime - startTime;
}

var loadSound = function () {
	var request = new XMLHttpRequest();
	// request.open("GET", 'come_and_get_your_love.mp3', true);
  request.open("GET", 'aint_no_mountain_higher.mp3', true);
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