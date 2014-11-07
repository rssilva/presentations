var Battery = require('./battery.js');
var Robot = require('./robot.js');


var source = new Battery();
source.init(80);

var robot = new Robot();
robot.init(source);

robot.charge();
robot.charge();
