(function () {
	var interval;
	var toPlay = [];

	var getData = function () {
		$.ajax({
			url: '/data'
		}).done(function (data) {
			parse(data);
		});
	}

	var parse = function (data) {
		var decompressed = decompress(JSON.parse(JSON.parse(data)['audio']));

		for (var i = 0; i < decompressed.length; i++) {
			toPlay.push(decompressed[i]);
		}

		if (toPlay.length > 100000) {

			clearInterval(interval);
			playSample(toPlay);
			toPlay = [];
			startListen();
		}

		// console.log(JSON.parse(data)['audio'])
		// console.log(data)
		// console.log(decompressed)
		// console.log(decompressed.length)
		// playSample(decompressed);
	}

	var playSample = function (signal) {
	// console.log(signal)
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

	$('.stop').on('click', function () {
		clearInterval(interval);
	});

	$('.listen').on('click', function () {
		startListen();
	});

	var startListen = function () {
		getData();

		interval = setInterval(function () {
			getData();
		}, 1000)
	}
})();