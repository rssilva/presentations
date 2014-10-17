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
		quantize(data);
	});
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

var quantize = function (signal) {
	var quantized = signal;
	var average = 0;
	var decimal = 0;
	var match, modifier;

	_.map(signal, function (value) {
		average += value/signal.length;
	});

	if (Math.abs(average) > 1) {

	}

	if (Math.abs(average) < 1) {
		match = (average+'').match(/\.0{0,}/g)
	}

	if (match && match.length > 0) {
		match = match[0];
		match = match.replace('.', '');
		decimal = match.length;
	}

	modifier = Math.pow(10, 2 + decimal);

	var amplitude;

	quantized = _.map(quantized, function (value) {
		amplitude = value * modifier;

		amplitude = Math.round(amplitude);

		if (amplitude > 0 && amplitude > 16) {
			amplitude = 16
		}

		if (amplitude < 0 && amplitude < -16) {
			amplitude = -16
		}

		return amplitude/100;
	});

	
	console.log(_.max(quantized), _.min(quantized))

	play(quantized);
}

init();
