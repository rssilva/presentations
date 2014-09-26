<!DOCTYPE html>
<html>
<head>
	<meta charset="utf-8">
	<title>Push State</title>
	<style type="text/css">
		html, body, ul{
			padding: 0;
			margin: 0;
		}

		li {
			list-style: none;
		}

		.app {
			padding: 30px 0 40px 0;
			min-height: 300px;
			background-color: #289085;
			margin: 0 auto;
			width: 80%;
			min-width: 1300px;
			text-align: center;
		}

		.app h1 {
			font-size: 50px;
		}

		.post-list li {
			margin-bottom: 40px;
		}

		.post-list li, img {
			margin-right: auto;
			margin-left: auto;
			width: 500px;
			text-align: center;
		}

		.post-list h3 {
			font-size: 40px;
		}

		.loader-container {
			height: 200px;
		}
	</style>
</head>
<body>
	<div class="app">
		<h1 >
			My Awesome Stormtrooper Blog
		</h1>
		<ul class="post-list">
			
		</ul>
		<div class="loader-container"></div>
	</div>
	<script src="jquery.js"></script>
	<script>
		var lastRequest = 0;
		var ended = false;
		var lastPost;
		var isLoading;

		init();
		bindEvents();

		function init () {

		}

		function bindEvents () {
			$('.loader-container').on('mouseenter', function (ev) {
				onMouseMove(ev)
			});

			$('.loader-container').on('mouseleave', function (ev) {
				onMouseMove(ev)
			});
		}

		function onMouseMove (ev) {
			getPost(lastPost);
		}

		function onData (data) {
			isLoading = false;

			if (data.id) {
				lastPost = data.id;
			}

			if (!data.id) {
				ended = true
			}

			renderPost(data);
		}

		function renderPost (post) {
			if (post.title && post.image) {
				var template = '<li> <h3>' + post.title + '</h3> <img src="' + post.image + '"> <h4>' + post.description + ' </h4></li>';

				doPushState(post);

				document.querySelector('.post-list').innerHTML += template;
			}
		}

		function doPushState (post) {
			history.pushState(post, post.title, post.url);
		}

		function getPost () {
			var data = {};
			var current = new Date().getTime();
			var delta;

			if (lastPost != undefined) {
				data.lastPost = lastPost;
			}

			delta = current - lastRequest;
			
			if (!ended && !isLoading && delta > 1000) {
 				lastRequest = current;
				isLoading = true;

 				$.ajax({
 					type: 'POST',
 					data: data,
 					url: 'posts.php',
 					dataType: 'json'
 				}).done(function (data) {
 					onData(data);
 				}).error(function () {
 					console.log('error')
 				})
			}
		}
	</script>
</body>
</html>