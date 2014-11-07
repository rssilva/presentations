var SearchWidget = function () {
	return {
		init: function (el) {
			this.el = el;
			this.input = this.el.find('.search-input');
		},

		bindClick: function (callback) {
			this.el.find('.go-button').on('click', function () {
				var query = this.input.val();

				callback(query);
			}.bind(this));
		}
	}
}
