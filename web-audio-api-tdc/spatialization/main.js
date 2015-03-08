var context = new (window.AudioContext || window.webkitAudioContext)();
var startOffset = 0;
var startTime = 0;
var filters = [];
var panel = $('.direction-panel');
var panelWidth = $('.direction-panel').width();
var sample, analyser, soundBuffer, source, panner;

var init = function () {
	sample = new VisualizerSample();
	analyser = sample.getAnalyser();
	sample.draw2();

	bind();
	setPanner();
	loadSound();
}

var setPanner = function () {
	panner = context.createPanner();
	panner.coneOuterGain = 10;
	panner.coneOuterAngle = 180;
	panner.coneInnerAngle = 0;

	context.listener.setPosition(0, 0, 0);

	panner.connect(analyser);
}

var bind = function () {
	var playPause = $('.play-pause');
	

	playPause.on('click', function () {
		playPause.toggleClass('isPlaying')
		playPause.hasClass('isPlaying') ? playBuffer(soundBuffer) : pauseBuffer(soundBuffer);
	});

	$('.add-filter').on('click', function () {
		appendFilter($('.filter-type').val());
	});

	panel.on('mousemove', function (ev) {
		onMouseMove(ev.offsetX, ev.offsetY);
	});
}

var onMouseMove = function (x, y) {
	var x = 25 * (x / panelWidth - 0.5);
    var y = -y / panel.height();

	panner.setPosition(x, y, 0);
}

var playBuffer = function (buffer) {
	startTime = context.currentTime;

	source = context.createBufferSource();

	source.buffer = buffer;
	source.loop = true;

	source.connect(panner);

	source[source.start ? 'start' : 'noteOn'](0, startOffset % buffer.duration);
}

var pauseBuffer = function () {
	source[source.stop ? 'stop': 'noteOff'](0);
    startOffset += context.currentTime - startTime;
}

var appendFilter = function (type) {
	var templateLowPass = '<div> <input class="slider" type="range" min="20" max="20000" step="10" /><input type="text" class="sliderValue" size="5"> </div>';
	var template = '';

	if (type === 'lowpass') {
		template = $(templateLowPass);
	}

	if (type === 'highpass') {
		template = $(templateLowPass);
	}

	if (type === 'bandpass') {
		template = $(templateLowPass);
	}

	$('.filters').append( template )

	filter = addFilter(type);
	bindFilter(template, filter);
}

var loadSound = function () {
	var request = new XMLHttpRequest();
	request.open("GET", 'come_and_get_your_love.mp3', true);
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