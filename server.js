/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable linebreak-style */
/* eslint-disable require-jsdoc */
/* eslint-disable linebreak-style */
//http://127.0.0.1:8080/
// import { readdir, readdirSync, statSync } from 'fs';
// import { createServer } from 'http';
const fs = require('fs');
const http = require('http');
let content = [];
function searchImg(arr, value) {
	let re = new RegExp(value, 'i');
	let str = '';
	for (let i = 0; i < arr.length; ++i) {
		if (arr[i].name.search(re) > -1) {
			str += `${i}/`;
		}
	}
	return str;
}
fs.readdir('./图片', (err, data) => {
	let time;
	//console.log(data);
	if (!data) {
		return;
	}
	for (let i of data) {
		time = fs.statSync(`./图片/${i}`).mtime;
		content.push({ name: i, time: time });
	}
	content.sort((a, b) => (a.time > b.time ? -1 : 1));
	//content = data;
});
const server = http.createServer((req, res) => {
	res.statusCode = 200;
	res.setHeader('Content-Type', 'text/plain');
});

server.listen('8081', () => console.log('http://localhost:8081/'));
server.on('request', (req, res) => {
	const urlObj = new URL('http://localhost' + req.url);
	const index = urlObj.searchParams.get('index');
	let pack = urlObj.searchParams.get('pack');
	const search = unescape(urlObj.searchParams.get('search'));
	res.setHeader('Access-Control-Expose-Headers', '*');
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Content-Type', 'image/jpeg');
	if (pack) {
		pack = decodeURIComponent(pack);
		const len = fs.readdirSync(`./图片/${pack}`).length;
		res.setHeader('Length', len);
	}
	if (index) {
		if (index >= content.length) {
			res.setHeader('Content', 'too-long');
		} else {
			res.setHeader('Content', escape(content[index].name));
		}
	}
	if (search) {
		res.setHeader('Search-Result', searchImg(content, search));
	}
	res.write('OKK');
	res.end();
});
