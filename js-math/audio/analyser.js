const maxValues = []

const startAnalyser = (audioContext, canvasCtx) => {
  var audioContext = audioContext
  var analyser = audioContext.createAnalyser()

  analyser.fftSize = 2048
  console.log(analyser)
  var bufferLength = analyser.fftSize
  var dataArray = new Uint8Array(bufferLength)
  analyser.getByteTimeDomainData(dataArray)

  const WIDTH = canvasCtx.canvas.width
  const HEIGHT = canvasCtx.canvas.height

  function drawTime() {
    drawVisual = requestAnimationFrame(drawTime);

    analyser.getByteTimeDomainData(dataArray);

    canvasCtx.fillStyle = 'rgb(255, 255, 255)';
    canvasCtx.fillRect(0, 0, WIDTH, HEIGHT);

    canvasCtx.lineWidth = 2;
    canvasCtx.strokeStyle = 'rgb(0, 0, 0)';

    canvasCtx.beginPath();

    var sliceWidth = WIDTH * 1.0 / bufferLength;
    var x = 0;

    // if (window.TIME_SIGNAL) {
    //   window.TIME_SIGNAL = window.TIME_SIGNAL.concat(dataArray)
    // }

    for(var i = 0; i < bufferLength; i++) {

      var v = dataArray[i] / 128.0;
      var y = v * HEIGHT/2;

      if(i === 0) {
        canvasCtx.moveTo(x, y);
      } else {
        canvasCtx.lineTo(x, y);
      }

      x += sliceWidth;
    }

    canvasCtx.lineTo(canvas.width, canvas.height/2);
    canvasCtx.stroke();
  }

  var bufferLength = analyser.frequencyBinCount;
  var dataArray = new Uint8Array(bufferLength);

  let max = 0
  let freq = 0

  function drawFreq() {
    drawVisual = requestAnimationFrame(drawFreq);

    analyser.getByteFrequencyData(dataArray);

    var barWidth = (WIDTH / bufferLength) * 2;
    var barHeight;
    var x = 0;

    for(var i = 0; i < bufferLength; i++) {
      barHeight = dataArray[i];

      if (barHeight > max) {
        max = barHeight
        freq = i
      }

      canvasCtx.fillStyle = 'rgb(' + (barHeight + 100) + ',50,50)';
      canvasCtx.fillRect(x, HEIGHT - barHeight * 0.8, barWidth, barHeight * 0.8);

      x += barWidth + 1;
    }

    // maxValues.push(freq)
  };

  drawTime()
  drawFreq()

  return analyser
}
