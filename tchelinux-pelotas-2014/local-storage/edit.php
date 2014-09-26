<?php 

?>

<!DOCTYPE html>
<html>
<head>
	<meta charset="utf-8">
	<title></title>
</head>
<body>
	<h1>Edição</h1>
	<span id="isConnected"></span>
	<section class="news"></section>
	<script src="http://localhost:1337/socket.io/socket.io.js"></script>
	<script>
		socket = io('http://localhost:1337');

		socket.on('connect', function () {

			console.log('connected')
		});

		socket.on('disconnect', function () {
			console.log('disconnect')
		});

		socket.on('message', function (data) {
			console.log('checkout', data)
		});

		function sendMessage (data) {
			if (socket) {
				socket.emit('message', data)
			}
		}
	</script>
</body>
</html>