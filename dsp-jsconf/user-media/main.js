// var context = new (window.AudioContext || window.webkitAudioContext)();
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

  if (navigator.getUserMedia) {
      navigator.getUserMedia({audio:true}, connectNodes, function(e) {
          console.log('error')
      });

  } else {
      console.log('getUserMedia not supported in this browser.');
  }

}

var connectNodes = function (stream) {
	var audioInput = context.createMediaStreamSource(stream);

	var bufferSize = 512;
	var recorder = context.createScriptProcessor(bufferSize, 2, 2);

	var counter = 0;
  time1 = new Date().getTime();
	recorder.onaudioprocess = onAudioProcess;

	audioInput.connect(recorder);
	recorder.connect(context.destination);
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
    data[i] = Math.round(data[i]*10)/10;
  }

  var processed = compress(data);
  
  return processed;
}

var inputBuffer, outputBuffer, inputData, outputData, compressed, decompressed;

var counter = 0;
var total = [];
var time1 = new Date().getTime();

var onAudioProcess = function (ev) {
  inputBuffer = ev.inputBuffer;

  outputBuffer = ev.outputBuffer;

  inputData = inputBuffer.getChannelData(0);
  outputData = outputBuffer.getChannelData(1);

  var processed = process(inputData);

  for (var sample = 0; sample < processed.length; sample++) {
    total.push(processed[sample]);
  }

  if (counter == 100) {
    // console.log(new Date().getTime() - time1);
    send(total);
    total = [];
    counter = 0;
  }

  counter++;
}

init();