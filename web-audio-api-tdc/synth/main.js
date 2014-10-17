var context = new (window.AudioContext || window.webkitAudioContext)();
var startOffset = 0;
var startTime = 0;
var filters = [];
var pressed = {};

var sample, analyser, soundBuffer, source;

//Top Gear Theme Notes
// var notes = {
// 	70: [ // F - c4 
// 	{
// 		type: 'square',
// 		frequency: 261.63
// 	}],
// 	86: [ // V - G3
// 	{
// 		type: 'square',
// 		frequency: 196
// 	}],
// 	68: [ // D - A#3
// 	{
// 		type: 'square',
// 		frequency: 233.08
// 	}],
// 	82: [ // R - D#4
// 	{
// 		type: 'square',
// 		frequency: 311.13
// 	}],
// 	69: [ // E - D4
// 	{
// 		type: 'square',
// 		frequency: 293.66
// 	}],
// 	84: [ // T - F4
// 	{
// 		type: 'square',
// 		frequency: 349.23
// 	}],

// 	89: [ // Y - G5
// 	{
// 		type: 'square',
// 		frequency: 392.00
// 	}],
// 	85: [ // U - G#5
// 	{
// 		type: 'square',
// 		frequency: 415.30
// 	}],

// }


//Mario Theme Notes
var notes = {
	84: [ // G t
	{
		type: 'square',
		frequency: 392
	}],
	89: [ // F#4 - y
	{
		type: 'square',
		frequency: 369.99
	}],
	85: [ // F4 - u
	{
		type: 'square',
		frequency: 349.23
	}],
	73: [ // E4 - i
	{
		type: 'square',
		frequency: 329.63
	}],
	66: [ // G#3 - c
	{
		type: 'square',
		frequency: 207.65
	}],
	86: [ // A3 - v
	{
		type: 'square',
		frequency: 220.00
	}],
	74: [ // C4 - j
	{
		type: 'square',
		frequency: 261.63
	}],
	72: [ // D4 - h
	{
		type: 'square',
		frequency: 293.66
	}],
	71: [ // D#4 - g
	{
		type: 'square',
		frequency: 311.13
	}],
	70: [ // E4 - g
	{
		type: 'square',
		frequency: 329.63
	}],
	82: [ //  - E
	{
		type: 'square',
		frequency: 440.00
	}],

	
}



var init = function () {
	sample = new VisualizerSample();
	analyser = sample.getAnalyser();
	sample.draw2();

	bind();
}

var bind = function () {
	var playPause = $('.play-pause');


	$(window).on('keydown', function (ev) {
		console.log(ev.keyCode)
		if (pressed[ev.keyCode] && pressed[ev.keyCode].released && notes[ev.keyCode]) {
			pressed[ev.keyCode] = {
				time: ev.timeStamp,
				released: false
			};

			onPress(ev.keyCode);
		}

		if (!pressed[ev.keyCode] && notes[ev.keyCode]) {
			pressed[ev.keyCode] = {
				time: ev.timeStamp,
				released: false
			};

			onPress(ev.keyCode);
		}
	});

	$(window).on('keyup', function (ev) {
		if (pressed[ev.keyCode] && notes[ev.keyCode]) {
			onRelease(ev.keyCode);
			pressed[ev.keyCode].released = true;
		}
	});
}

var onPress = function (key) {
	if (pressed[key] && notes[key]) {
		addOscilator(key)
	}
}

var addOscilator = function (key) {
	
	notes[key].forEach(function (obj, val) {
		obj.oscillator = context.createOscillator();
		obj.oscillator.frequency.value = obj.frequency;
		obj.oscillator.type = obj.type;

		obj.oscillator.connect(analyser);

		obj.oscillator.start(0);
	});
}

var onRelease = function (key) {
	notes[key].forEach(function (obj) {
		obj.oscillator.stop();
	})
}


init();
