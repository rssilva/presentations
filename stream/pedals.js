var PedalCollection = function () {
	return {
		init: function () {
			this.pedals = [];
			this.counter = 0;
			this.buffer = [];
		},

		turnOnPedal: function () {

		},

		process: function (options) {
			var leftIn = options.leftIn,
				leftOut = options.leftOut,
				i, 
				len = leftOut.length,
				pedal, 
				pedalsLen = this.pedals.length,
				current = 0;

			for (i = 0; i < len; i++) {
				current = (leftIn[i]);
				for (pedal = 0; pedal < pedalsLen; pedal++) {
					current += this.pedals[pedal].process(leftIn[i]);
				}

				leftOut[i] = current;
			}
			this.counter++;
		},

		turnOffPedal: function () {

		},

		turnOffAll: function () {

		},

		addPedal: function (pedal) {
			this.pedals.push(pedal);
		}
	}
}



var Eightbits = function (options) {
	return {
		init: function () {
			this.options = options;
			
			this.isOn = false;
			
			this.bindEvents();
		},

		process: function (value) {
			if (this.isOn) {
				value = 16*value;

				value = Math.round(value);
				
			}

			return value;
		},

		toggleLed: function () {
			if (this.options.$el) {
				if (this.isOn) {
					this.options.$el.find('.led').addClass('led-red')
				} else {
					this.options.$el.find('.led').removeClass('led-red')
				}
			}
		},

		set: function () {
			//toggle pedal state
			if (this.isOn) {
				this.isOn = false;
				this.toggleLed(false);
			} else {
				this.isOn = true;
				this.toggleLed(true);
			}
		},

		bindEvents: function () {
			var that = this;

			if (this.options.$el) {

				this.options.$el.find('.onOff').on('click', function () {
					that.set();
				});

			}
		}
	}
}