define(["exports"], function(exports) {
  "use strict";
  var Battery = function () {
      this.init = function (level) {
          this.level = level;
      }
  }

  exports.Battery = Battery;
});
