var $list = $('#oscillators');
var slider = $('#slider');
var oscillators = [];
var context = new (window.AudioContext || window.webkitAudioContext)();
var sample, analyser;

var init = function () {
	sample = new VisualizerSample();
	analyser = sample.getAnalyser();
	sample.draw2();

	bind();
}

var bind = function () {
	$('#addButton').on('click', function () {
		appendOscillator();
	});
}

var appendOscillator = function () {
	var el = '<li><input class="slider" type="range" min="20" max="20000" step="10" /><input type="text" class="sliderValue" size="5">	<button class="play">Play</button>	<button class="stop">Stop</button> <button class="sine">Sine</button><button class="square">Square</button><button class="sawtooth">Sawtooth</button><button class="triangle">Triangle</button></li>';

	var $el = $(el);

	var oscillator = new Oscillator({
		$el: $el,
		chainNode: analyser
	});

	oscillator.init();

	$list.append($el);
}

init();