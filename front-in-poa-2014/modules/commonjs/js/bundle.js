(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var Battery = function () {
    this.init = function (level) {
        this.level = level;
    }
}

module.exports = Battery;

},{}],2:[function(require,module,exports){
var Battery = require('./battery.js');
var Robot = require('./robot.js');


var source = new Battery();
source.init(80);

var robot = new Robot();
robot.init(source);

robot.charge();
robot.charge();

},{"./battery.js":1,"./robot.js":3}],3:[function(require,module,exports){
var Robot = function () {
    this.init = function (battery) {
        this.battery = battery;
    }
    this.charge = function () {
        this.battery.level++;
        console.log(this.battery.level)
    }
    this.setWheel = function () {

    }
}

module.exports = Robot;

},{}]},{},[2]);
