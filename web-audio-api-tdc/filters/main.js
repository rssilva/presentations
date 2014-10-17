var context = new (window.AudioContext || window.webkitAudioContext)();
var startOffset = 0;
var startTime = 0;
var filters = [];
var sample, analyser, soundBuffer, source;

var init = function () {
	sample = new VisualizerSample();
	analyser = sample.getAnalyser();
	sample.draw2();

	bind();
	loadSound();
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
}

var playBuffer = function (buffer) {
	startTime = context.currentTime;

	source = context.createBufferSource();

	connect();

	source.buffer = buffer;
	source.loop = true;

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

var bindFilter = function (template, filter) {
	var slider = template.find('.slider');

	slider.on('change', function () {
		filter.frequency.value = slider.val();

		template.find('.sliderValue').val(slider.val())
	});
}

var connect = function () {
	if (filters.length > 0) {

		source.disconnect();
		source.connect(filters[0]);

		for (var i = 1, len = filters.length; i < len; i++) {
			filters[i-1].connect(filters[i]);
		}

		filters[i - 1].connect(analyser);
	}

	if (filters.length === 0) {
		source.connect(analyser);
	}
}

var addFilter = function (type) {
	var filter = context.createBiquadFilter();
	filter.type = type;
	filter.frequency.value = 100;

	filters.push(filter);
	connect();

	return filter;
}

var loadSound = function () {
	var request = new XMLHttpRequest();
	request.open("GET", 'paper_navy_swan_song.mp3', true);
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
		soundBuffer = buffer;
	}
}

init();