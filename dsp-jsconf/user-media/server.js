var http = require('http');
var fs = require('fs');
var qs = require('querystring');

var staticPattern = /\.js/;
var url;
var content;
var data = '';

http.createServer(function (req, res) {
	var body = '';
	content = '';
	url = req.url;
	
	if (url == '/') {
		content = fs.readFileSync('./index.html', 'utf-8');
		res.write(content);
	}

	if (url == '/receiver') {
		content = fs.readFileSync('./receiver.html', 'utf-8');
		res.write(content);
	}

	if (staticPattern.test(url)) {
		content = fs.readFileSync('./' + url, 'utf-8');
		res.write(content);
	}

	if (url == '/data') {
		res.write(JSON.stringify(data));
	}

	if (url == '/sendData') {
		req.on('data', function (data) {
      body += data;

      // Too much POST data, kill the connection!
      // if (body.length > 1e6)
      //   req.connection.destroy();
    });
    req.on('end', function () {
      var post = qs.parse(body);
      console.log(JSON.stringify(post).length)
      data = post;
      // use post['blah'], etc.
    });

		res.write('send');
	}
	
	res.end();
}).listen(4000);