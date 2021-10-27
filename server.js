/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable linebreak-style */
/* eslint-disable require-jsdoc */
/* eslint-disable linebreak-style */
//http://127.0.0.1:8080/
// import { readdir, readdirSync, statSync } from 'fs';
// import { createServer } from 'http';
import fs from 'fs';
import http from 'http';
import root from './root.js';
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
fs.readdir(`./${root}`, (err, data) => {
	let time;
	//console.log(data);
	if (!data) {
		return;
	}
	for (let i of data) {
		time = fs.statSync(`./${root}/${i}`).mtime;
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
	console.log(req.data);
	const urlObj = new URL('http://localhost' + req.url);
	const index = urlObj.searchParams.get('index');
	let pack = urlObj.searchParams.get('pack');
	const img = urlObj.searchParams.get('img');
	const search = decodeURIComponent(urlObj.searchParams.get('search'));
	res.setHeader('Access-Control-Expose-Headers', '*');
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Content-Type', 'image/jpeg');
	if (pack) {
		pack = decodeURIComponent(pack);
		const len = fs.readdirSync(`./${root}/${pack}`).length;
		res.setHeader('Length', len);
	}
	if (index) {
		if (index >= content.length) {
			res.setHeader('Content', 'too-long');
		} else {
			res.setHeader('Content', encodeURIComponent(content[index].name));
		}
	}
	if (search) {
		res.setHeader('Search-Result', searchImg(content, search));
	}
	if (img) {
		try {
			let data = fs.readFileSync(
				`./${root}/${content[img].name}/1.jpg`,
				'binary'
			);
			res.write(data, 'binary');
		} catch (error) {
			console.error(error);
		}
	}
	res.write('OKK');
	res.end();
});
