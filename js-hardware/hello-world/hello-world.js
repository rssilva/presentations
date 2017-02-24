var five = require('johnny-five');

// Instanciamos uma placa, que neste caso
//  será a do Arduino que se comunicará com o computador
var board = new five.Board();

// O evento de ready é disparado quando a comunicação
//  é estabelecida entre o processo Node.js e o Arduino
board.on('ready', function() {
  // Instanciamos um led no pino 13
  var led = new five.Led(13);

  this.repl.inject({
    led: led
  });

  // Chamamos o método blink do led que recebe
  //  a duração da fase que piscará em milissegundos
  led.blink(500);
});
