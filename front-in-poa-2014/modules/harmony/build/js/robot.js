define(["exports"], function(exports) {
  "use strict";
  var Robot = function () {
      this.init = function (battery) {
          this.battery = battery;
      }
      this.charge = function () {
          this.battery.level++;
          console.log(this.battery.level)
      }
  }

  exports.Robot = Robot;
});
