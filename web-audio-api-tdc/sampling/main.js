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
}

var bind = function () {
	var playPause = $('.play-pause');

	playPause.on('click', function () {
		getSignalData()
	});
}

var getSignalData = function () {
	$.ajax({
		dataType: 'json',
		url: 'sample.json'
	}).done(function (data) {
		resample(data);
	})
}

var play = function (signal) {
	var buffer = context.createBuffer(2, signal.length - 1, 44100);
	var leftChannelData = buffer.getChannelData(0);
	var rightChannelData = buffer.getChannelData(1);

	var data = buffer.getChannelData(0);
	var dataRight = buffer.getChannelData(1);

	for (i = 0; i < data.length; i++) {
		
	    data[i] = signal[i];
	    
	}

	startTime = context.currentTime;

	source = context.createBufferSource();

	source.connect(analyser);

	source.buffer = buffer;
	source.loop = false;

	source[source.start ? 'start' : 'noteOn'](0, startOffset % buffer.duration);
	
}

var resample = function (signal) {
	var resampled = [];
	var factor = 1;
	var counter = 0;

	// factor representa o intervalo onde será reamostrado o sinal

	signal.forEach(function (val, i) {
		if (i%factor === 0) {
			resampled.push(val)
		}

		if (i%factor !== 0) {
			resampled.push(0)
		}
	});

	resampled.forEach(function (val, i) {
		if (val === 0) {
			counter++;
		}
	});

	console.log(counter)

	play(resampled);

	return resampled;
}

init();
