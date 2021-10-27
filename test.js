import http from 'http';
import url from 'url';
function onRequest(req, resp) {
	console.log(url.parse(req.url, true).query);
	//返回响应
	resp.writeHead(200, { 'ContentType': 'text/html;charset=utf-8' });
	resp.end();
}

//创建server
http.createServer(onRequest).listen(9998);
