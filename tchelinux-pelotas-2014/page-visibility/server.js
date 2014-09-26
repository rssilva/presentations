var http = require('http');
var fs = require('fs');
var querystring = require('querystring');

var router = function (req, res, callback) {
	var url = req.url;
	var content = '';

	if (req.method == 'GET') {
		if (url === '/') {
			content = fs.readFileSync('./index.html', 'utf-8');

			res.writeHead(200, {'Content-Type': 'text/html'});

			res.write(content);
            res.end();
		}
	}

	if (req.method == 'POST') {
        var body = '';

        req.on('data', function (data) {
            body += data;

            if (body.length > 1e6)
                req.connection.destroy();
        });

        req.on('end', function () {
            var post = querystring.parse(body);

            console.log(post)

            if (url === '/random') {
            	content = JSON.stringify({
            		content: Math.round(Math.random()*100000)
            	});

            	res.writeHead(200, {'Content-Type': 'application/json'});
            }

            res.write(content);
            res.end();
        });
    }
}


var server = http.createServer(function (req, res) {
	// console.log(req.url)
	router(req, res);
}).listen(1337);

console.log('listen on 1337');