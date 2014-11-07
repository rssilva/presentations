(function () {
	'use strict'

	var anonymBtn = document.querySelector('#anonym');
	var declaredBtn = document.querySelector('#declared');

	var myHandler = function () {
		console.log('declared');
		var a = 1 + b;
	}
	
	anonymBtn.addEventListener('click', function () {
		console.log('anonym');
		var a = 1 + b;
	});

	declaredBtn.addEventListener('click', myHandler, false);

})();
