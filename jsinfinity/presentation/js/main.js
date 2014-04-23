var body = $('body');
var current = 1;
var slides = $('.slide');
var $window = $(window);

$(window).on('keyup', function (e) {
	var keyCode = e.keyCode;

	if (keyCode === 39) {
		next();
	} else if (keyCode === 37 ) {
		back();
	}
});

var goToHash = function () {
	if (window.location.hash) {
		current = window.location.hash.replace('#', '');

		changeByIndex(current);
	}
}

var next = function () {
	current++

	if (current > slides.length) {
		current = slides.length;
	}

	changeByIndex();

	window.location.hash = current;
}

var changeByIndex = function (goTo) {
	//goTo !== undefined ? current = goTo : current++;
	
	slides.each(function (index) {
		if (index !== current - 1) {
			$(this).hide();
		} else {
			$(this).show();
		}
	});

	$window.trigger('changed', {
		slide: $(slides[current-1]),
		current: current
	});
}

var back = function () {
	current--;

	if (current < 1) {
		current = 1;
	}

	changeByIndex();

	window.location.hash = current;
}

// $('.slide').each(function (index) {
// 	$(this).append('<button>next</button>');
// });

$('pre.code').highlight({source:1, zebra:1, indent:'space', list:'ol'});

goToHash();