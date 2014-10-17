var Oscillator = function (options) {
	return {
		init: function () {
			this.options = options;

			this.$el = options.$el;
			this.chainNode = options.chainNode;

			this.slider = this.$el.find('.slider');
			this.sliderValue = this.$el.find('.sliderValue');

			this.bindEvents();
			this.startSlider();
		},

		startSlider: function () {
			var min = this.slider.attr('min');

			this.slider.val(min);
			this.$el.find('.sliderValue').val(min);
		},


		start: function (frequency) {
			if (this.chainNode) {
				this.oscillator = context.createOscillator();
				this.oscillator.frequency.value = frequency || this.slider.val();

				this.oscillator.connect(this.chainNode);
				this.oscillator.noteOn(0);
			}
		},

		play: function (freq) {
			var frequency = freq || this.slider.val();

			if (this.oscillator && this.chainNode) {
				this.oscillator.connect(this.chainNode);
				this.oscillator.frequency.value = frequency || this.slider.val();
			} else {
				this.start(frequency);
			}
		},

		stop: function () {
			if (this.oscillator) {
				this.oscillator.disconnect();
			}
		},

		setChainNode: function (node) {
			this.chainNode = node;
		},

		switchToFrequency: function (frequency) {
			if (this.oscillator && this.chainNode) {
				this.oscillator.disconnect();
				this.oscillator.frequency.value = frequency;
				this.oscillator.connect(this.chainNode);
			}
		},

		changeWaveType: function (type) {
			if (this.oscillator) {
				this.oscillator.type = type;
			}
		},

		bindEvents: function () {
			var that = this;

			this.slider.on('change', function () {
				that.switchToFrequency(this.value);
				that.sliderValue.val(this.value);
			});

			this.$el.find('.play').on('click', function () {
				that.play();
			});

			this.$el.find('.stop').on('click', function () {
				that.stop();
			});

			this.$el.find('.sine').on('click', function () {
				that.changeWaveType('sine');
			});

			this.$el.find('.square').on('click', function () {
				that.changeWaveType('square');
			});

			this.$el.find('.sawtooth').on('click', function () {
				that.changeWaveType('sawtooth');
			});

			this.$el.find('.triangle').on('click', function () {
				that.changeWaveType('triangle');
			});
		}
	}
}