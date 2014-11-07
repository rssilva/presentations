var UserList = function () {
	return {
		init: function (el) {
			this.el = el;
		},

		onData: function (data) {
			this.render(data);
		},

		render: function (users) {
			var str = '';

			users.forEach(function (user) {
				str += '<li>' + user.name + '</li>';
			});

			this.el[0].innerHTML = str;
		},

		get: function (query) {
			$.ajax({
				url: 'users.json',
				data: {
					query: query
				}
			}).done(this.onData.bind(this));
		}
	}
};

(function () {
	var userList = new UserList();
	userList.init($('.userList'));

	var searchWidget = new SearchWidget();
	searchWidget.init($('.searchWidget'));

	searchWidget.bindClick(function (query) {
		userList.get(query);
	});

	// var searchWidget = new SearchWidget();
	// searchWidget.init($('.searchWidget'));
	// searchWidget.bindClick();
})();
