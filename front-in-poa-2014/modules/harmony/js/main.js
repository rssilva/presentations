import { Battery } from 'battery.js';
import { Robot } from 'robot.js';

var source = new Battery();
source.init(80);

var robot = new Robot();
robot.init(source);

robot.charge();
robot.charge();


