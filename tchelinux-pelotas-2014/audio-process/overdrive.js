var Overdrive = function (options) {
	return {
		init: function () {
			this.options = options;

			this.isOn = false;
			this.config();
			this.bindEvents();
		},


		config: function () {
			this.gain = 1;
			this.clipping = 0.05;

			if (this.options.$el) {
				this.gainDisplay = this.options.$el.find('.gainDisplay');
				this.clippingDisplay = this.options.$el.find('.clippingDisplay');
				this.clippingFactorDisplay = this.options.$el.find('.clippingFactorDisplay');

				this.changeGain(this.options.$el.find('.gain').val())
				this.changeClipping(this.options.$el.find('.clipping').val());
				this.changeClippingFactor(this.options.$el.find('.clippingFactor').val());
			}
		},

		process: function (value) {
			if (this.isOn) {

				if (Math.abs(value) > this.clipping) {
					value = this.clipSignal(value);
				}

				value = this.gain*value;
			}
			
			return value;
		},

		clipSignal: function (value, clipTo) {
			if (value > 0) {
				value = this.clipping + value/this.clipFactor;
			} else {
				value = -(this.clipping + value/this.clipFactor);
			}

			return value;
		},

		changeClipping: function (value) {
			if (this.clippingDisplay) {
				this.clippingDisplay.val(value);

				this.clipping = parseFloat(value, 10);
			}
		},

		changeClippingFactor: function (value) {
			if (this.clippingFactorDisplay) {
				this.clippingFactorDisplay.val(value);
			}
		},

		changeGain: function (value) {
			if (this.gainDisplay) {
				this.gainDisplay.val(value);

				this.gain = value;
			}
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

				this.options.$el.find('.clipping').on('change', function () {
					that.changeClipping(this.value);
				});

				this.options.$el.find('.clippingFactor').on('change', function () {
					that.changeClippingFactor(this.value);
				});

				this.options.$el.find('.gain').on('click', function () {
					console.log(this.value)
					that.changeGain(this.value);
				});

				this.options.$el.find('.onOff').on('click', function () {
					that.set();
				});

			}
		}
	}
}