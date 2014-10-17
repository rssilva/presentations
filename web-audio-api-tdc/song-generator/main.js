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
		playGenerated()
	});

}

var playGenerated = function () {
	
	
	var samples = 44100;
	var duration = 1;
	var LENGTH = duration * samples;
	var f = 440/LENGTH;


	var buffer = context.createBuffer(2, LENGTH, 44100);
	var leftChannelData = buffer.getChannelData(0);
	var rightChannelData = buffer.getChannelData(1);

	var dataLeft = buffer.getChannelData(0);
	var dataRight = buffer.getChannelData(1);


	// diferentes equações para gerar áudio
	for (i = 0; i < dataLeft.length; i++) {
		// volume decrescente...
	    // data[i] = 10000/i*Math.sin(2 * Math.PI * f * i);

	    // volume crescente...
	    // data[i] = i/100*Math.sin(2 * Math.PI * f * i);

	    // frequência variável...
	    dataLeft[i] = Math.sin(2 * Math.PI * (f + f/8000*i) * i);
	    
	}

	startTime = context.currentTime;

	source = context.createBufferSource();

	source.connect(analyser);

	source.buffer = buffer;
	source.loop = false;

	source[source.start ? 'start' : 'noteOn'](0, startOffset % buffer.duration);

}

init();