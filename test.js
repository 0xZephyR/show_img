import bodyParser from 'body-parser';
import express from 'express';
var app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
const checkAccount = (value) => {
	if (value.username === '123' && value.password === '123') {
		return true;
	}
	return false;
};
app.listen(8000, function () {
	console.log('server running on port: 8000');
});
app.all('*', function (req, response, next) {
	undefined;
	//设置允许跨域的域名，*代表允许任意域名跨域
	response.header('Access-Control-Allow-Origin', '*');
	//允许的header类型
	response.header('Access-Control-Allow-Headers', '*');
	//跨域允许的请求方式
	response.header(
		'Access-Control-Allow-Methods',
		'PUT,POST,GET,DELETE,OPTIONS'
	);
	//设置响应头信息
	response.header('X-Powered-By', ' 3.2.1');
	response.header('Content-Type', 'application/json');

	next();
});
app.get('/index', function (req, res) {
	res.sendFile(__dirname + '/index.html');
});

app.post('/login', function (req, res) {
	res.header('Access-Control-Allow-Origin', '*');
	console.log(req.body);
	res.json({ status: checkAccount(req.body) }).end();
});
