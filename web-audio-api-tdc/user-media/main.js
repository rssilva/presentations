var context = new (window.AudioContext || window.webkitAudioContext)();
var startOffset = 0;
var startTime = 0;
var filters = [];
var sample, analyser, soundBuffer, source;

var init = function () {
    if (!navigator.getUserMedia) {
        navigator.getUserMedia = navigator.getUserMedia || 
        	navigator.webkitGetUserMedia ||
			navigator.mozGetUserMedia ||
			navigator.msGetUserMedia;
    }

    if (navigator.getUserMedia){
    	
        navigator.getUserMedia({audio:true}, success, function(e) {
            console.log('error')
        });

    } else {
        console.log('getUserMedia not supported in this browser.');
    }

    function success (stream) {
		connectNodes(stream);
    }
}

var connectNodes = function (stream) {
	var audioInput = context.createMediaStreamSource(stream);

	var bufferSize = 512;
	var recorder = context.createScriptProcessor(bufferSize, 2, 2);

	var counter = 0;

	var delay1 = context.createDelay();
	delay1.delayTime.value = 0.5;

	var delay2 = context.createDelay();
	delay2.delayTime.value = 1;

	audioInput.connect(delay1);
	audioInput.connect(delay2);
	audioInput.connect(context.destination);

	delay1.connect(context.destination)
	delay2.connect(context.destination)
}

init();