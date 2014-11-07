var SearchWidget = function () {
	return {
		init: function (el) {
			this.el = el;
			this.input = this.el.find('.search-input');
		},

		onData: function (data) {
			this.renderList(data);
		},

		renderList: function (users) {
			var str = '';

			users.forEach(function (user) {
				str += '<li>' + user.name + '</li>';
			});

			$('.userList').html(str);
		},

		get: function (query) {
			$.ajax({
				url: 'users.json',
				data: {
					query: query
				}
			}).done(this.onData.bind(this));
		},

		bindClick: function () {
			$('.go-button').on('click', function () {
				var query = this.input.val();

				this.get(query);
			}.bind(this));
		}
	}
}
