define(
  ["exports", "battery.js", "robot.js"],
  function(exports, _batteryJs, _robotJs) {
    "use strict";
    var Battery = _batteryJs.Battery;
    var Robot = _robotJs.Robot;

    var source = new Battery();
    source.init(80);

    var robot = new Robot();
    robot.init(source);

    robot.charge();
    robot.charge();
  }
);


