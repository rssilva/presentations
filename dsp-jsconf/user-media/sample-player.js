var context = new (window.AudioContext || window.webkitAudioContext)();

(function () {

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
			process(data);
			// play(data);
		});
	}

	var send = function (data) {
		$.ajax({
			type: 'POST',
			dataType: 'json',
			url: '/sendData',
			data: {audio: JSON.stringify(data)}
		}).done(function (received) {
			console.log(received)
		});
	}

	var process = function (data) {
		var i;
		var len = data.length;

		for (i = 0; i < len; i++) {
			data[i] = Math.round(data[i]*100)/100;
		}
		var compressed = compress(data);
		var decompressed = decompress(data);

		console.log(data.length, _.min(data), _.max(data))
		console.log(JSON.stringify(compressed).length)
		console.log(JSON.stringify(compressed).length/JSON.stringify(data).length)
		console.log(compressed)
		playSample(decompressed);
		// console.log(compressed)
		send(compressed);
	}

	var playSample = function (signal) {
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

		source.connect(context.destination);

		source.buffer = buffer;
		source.loop = false;

		source[source.start ? 'start' : 'noteOn'](0);
	
	}

	init();

})()