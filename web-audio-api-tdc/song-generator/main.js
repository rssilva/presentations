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

var testing = function () {

}

var square = function (freq, amplitude) {
	return function (time) {
		return Math.sin(6.28 * freq * time) > 0 ? amplitude : -amplitude
	}
}

var square2 = function (freq, amplitude, time) {
	return Math.sin(6.28 * freq * time) > 0 ? amplitude : -amplitude
}

var plot = function (wave, axis) {
	data = {
	    //labels: ["January", "February", "March", "April", "May", "June", "July"],
	    labels: axis,
	    datasets: [
	        {
	            label: "My First dataset",
	            fillColor: "rgba(220,220,220,0.2)",
	            strokeColor: "rgba(220,220,220,1)",
	            pointColor: "rgba(220,220,220,1)",
	            pointStrokeColor: "#fff",
	            pointHighlightFill: "#fff",
	            pointHighlightStroke: "rgba(220,220,220,1)",
	            data: wave
	        }
	    ]
	};

	var ctx = document.getElementById("canvas3").getContext("2d");
	var myNewChart = new Chart(ctx).Line(data);

}

function pluck (t, freq, duration, steps) {
    var n = duration;
    var scalar = Math.max(0, 0.95 - (t * n) / ((t * n) + 1));
    var sum = 0;
    for (var i = 0; i < steps; i++) {
        sum += Math.sin(2 * Math.PI * t * (freq + i * freq));
    }
    return scalar * sum / 6;
}

function violin () {
	var samples = [];
	var f = 698.46; // 698.46 Hertz = F4 note
	var samples_length = 44100;
	for (var i=0; i < samples_length ; i++) {
		var t = i/samples_length;
		var y=0;
		var A_total = 0;
		for (var harm=1;harm<=7;harm++) {
			var f2 = f*harm;
			var A = 1/harm;
			A_total += A;
			y += A*Math.sin(f2*2*3.14*t);
		}
		samples[i] = y/A_total;
		samples[i] *= (1-0.5*Math.sin(2*3.14*6*t)); // Add a low frequency amplitude modulation
		samples[i] *= (1-Math.exp(-t*3));
	}

	return samples
}

function accordion () {
	var samples = [];
	var frequency = [392, 659.26, 783.99, 1046.5]; // "C4+E4+G4+C5" notes
	var samples_length = 44100;               
	for (var i=0; i < samples_length ; i++) { // fills array with samples
	  var t = i/samples_length;               // time from 0 to 1
	  samples[i] = (Math.sin( frequency[0] * 2*3.14*t ) + Math.sin( frequency[1] * 2*3.14*t )+ Math.sin( frequency[2] * 2*3.14*t ) + + Math.sin( frequency[3] * 2*3.14*t ))/4 ;
	}
	
	return samples;
}

function laser () {
	var samples = [];

	for (var i=0; i < 44100; i++) {
	  var t = i/44100;
	  samples[i] = Math.sin(Math.pow(5 * 2*3.14*(1-t),3.6) );
	}

	return samples;
}

var playGenerated = function () {
	
	
	var samples = 44100;
	
	var duration = 3;
	var LENGTH = duration * samples;
	var f = 440/LENGTH;


	var buffer = context.createBuffer(2, LENGTH, 44100);
	var dataLeft = buffer.getChannelData(0);
	var dataRight = buffer.getChannelData(1);

	var w1 = 2000;
	var w2 = 100;
	var Ka = 0.8;
	var sqWave = square(1, 1);
	var wave = [];
	var axis = [];

	var melody = [ 200, 240, 360, 340, 180, 190, 200 ];
	var note = 0

	var violinArr = violin();
	//var accordionArr = accordion();
	var laserArr = laser();
	

	// diferentes equações para gerar áudio
	for (i = 0; i < dataLeft.length; i++) {
		// volume decrescente...
	    // dataLeft[i] = 10000/i*Math.sin(2 * 3.14 * f * i);

	    // volume crescente...
	    // data[i] = i/100*Math.sin(2 * Math.PI * f * i);

	    // frequência variável...
	    // dataRight[i] = Math.sin(2 * Math.PI * (f + f/8000*i) * i);
	    // dataRight[i] = Math.cos(2 * 3.14 * 30 * i * (1 / Math.log(10*i)) )
	    
	    // Ring modulation
		// dataRight[i] = Math.cos ( (w1 + w2) * i ) + Math.cos( (w1 - w2) * i );

		// AM modulation of Math.cos(2 * 3.14 * w2 * i ) signal
		// dataRight[i] = (1 + Ka * Math.cos(2 * 3.14 * w2 * i ) * Math.cos(2 * 3.14 * w1 * i )) 

		// vibrato
		// dataRight[i] = Math.cos(2 * 3.14 * 100 * i + 3.14 ) + Math.cos(2 * 3.14 * 90 * i )

		// snare drum
		// dataRight[i] = Math.random() * 1000/i
		// dataRight[i] =  violinArr[i]

		//dataRight[i] = pluck(i % 0.5, 100, 10, 10);


		// playing notes
		// note = Math.floor( (i * 10) / (samples)/ melody.length );
		dataRight[i] = laserArr[i]



		// console.log(Math.floor( (i * 10) / (samples)/6 ))
		// wave[i] = sqWave(i)
		// axis[i] = i;
	}
	
	//plot(wave, axis);
		

	startTime = context.currentTime;

	source = context.createBufferSource();

	source.connect(analyser);

	source.buffer = buffer;
	source.loop = false;

	source[source.start ? 'start' : 'noteOn'](0, startOffset % buffer.duration);

}

init();