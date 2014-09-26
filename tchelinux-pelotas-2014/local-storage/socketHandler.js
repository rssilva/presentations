
	var isLSOn = window.localStorage && window.localStorage.setItem;
	var id = new Date().getTime() + Math.round(Math.random()*100);
	var acceptDelta = 30000;
	var renderedMessages = {};
	var socket;
	var messageList = document.querySelector('.news-list');

	init();

	function init () {
		console.log('id', id)

		if (isLSOn) {
			checkConnections();
			startTimer();
		}

		if (!isLSOn) {
			console.log('not on');
			connect();
		}
	}

	function checkConnections () {
		var should = false;
		var connections = getRegister('connections');

		try {
			connections = JSON.parse(connections);
		} catch (e) {
			connections = [];
		}

		if (!connections) {
			connections = [];
		}

		// console.log('connections', connections);

		should = shouldConnect(connections);

		if (should) {
			connections = [];
			connections.push(id);
			saveRegister('connections', JSON.stringify(connections));

			connect();
		}
	}

	function shouldConnect (connections) {
		var lastPing = getRegister('ping');
		var should = false;
		var delta = acceptDelta + 1;
		
		connections.length === 0 ? should = true : null;

		if (!lastPing) {
			should = true;
		}

		if (typeof lastPing === 'string') {
			lastPing = JSON.parse(lastPing);
		}

		if (lastPing) {
			delta = new Date().getTime() - lastPing.time;
		}

		if (delta > acceptDelta) {
			should = true;
		}
		
		if (delta < acceptDelta && connections[0] && connections[0] !== id) {
			closeIfOpened();
			should = false;
		}

		console.log('delta', delta, should)

		return should;
	}

	function closeIfOpened () {
		if (socket) {
			socket.close();
			socket = null;
		}
	}

	function connect () {
		if (!socket) {
			document.querySelector('#isConnected').innerText = 'connected';

			socket = io('http://localhost:1337');

			socket.on('connect', function () {

				console.log('connected')
			});

			socket.on('disconnect', function () {
				document.querySelector('#isConnected').innerText = '';
				console.log('disconnect')
			});

			socket.on('message', function (data) {
				onMessage(data);
			});
		}
	}

	function startTimer () {
		var period = Math.round(Math.random()*10000 + 10000);

		setInterval(function () {
			checkConnections();
			ping();
			checkMessages();
		}, period);
	}

	function ping () {
		var data;

		console.log('ping')

		if (socket) {
			data = {
				id: id,
				time: new Date().getTime()
			}

			saveRegister('ping', JSON.stringify(data));
		}
	}

	function onMessage (data) {
		console.log('message', data)

		renderMessage(data);
		renderedMessages[data.id] = data;
		addMessage(data);
	}

	function renderMessage (data) {
		var li;

		console.log('renderedMessages', renderedMessages)
		if (!renderedMessages[data.id]) {
			li = document.createElement('li');
			li.innerText = data.message;

			messageList.insertBefore(li);
		}
	}

	function checkMessages () {
		var messages = getRegister('messages');
		
		var i, len, k, messageId;

		try {
			messages = JSON.parse(messages);
		} catch (e) {
			messages = [];
		}

		if (!messages) {
			messages = [];
		}
		console.log(messages)
		
		for (k = 0, len = messages.length; k < len; k++) {
			messageId = messages[k].id

			if (!renderedMessages[messageId]) {
				renderMessage(messages[k]);
				renderedMessages[messageId] = messages[k];
				
			}
		}
		
	}

	function addMessage (data) {
		var messages = getRegister('messages');

		try {
			messages = JSON.parse(messages);
		} catch (e) {
			messages = [];
		}

		if (!messages) {
			messages = [];
		}

		messages.push(data);

		saveRegister('messages', JSON.stringify(messages));
	}

	function sendMessage (message) {
		if (socket) {
			socket.emit('message', {
				message: message
			});
		}
	}

	function saveRegister (key, value) {
		window.localStorage.setItem(key, value);
	}

	function getRegister (key) {
		return  window.localStorage.getItem(key);
	}

