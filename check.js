import fs from 'fs';
import readline from 'readline';
const root = './少女';
const dir = fs.readdirSync(root);
const fileList = [];
const read = readline.createInterface({
	input: process.stdin,
	output: process.stdout
});

for (let i of dir) {
	let flag = false;
	const files = fs.readdirSync(root + '/' + i);
	for (let f of files) {
		let stat = fs.statSync(root + '/' + i + '/' + f);
		if (stat.size < 1024) {
			fileList.push(i);
			flag = true;
			break;
		}
	}
	if (flag) {
		files.forEach((v, index) =>
			fs.unlink(root + '/' + i + '/' + v, (err) => {})
		);
	}
}

console.log(fileList);
console.log(fileList.length);
for (let file of fileList) {
	fs.rmdirSync(root + '/' + file);
}

console.log('finish');
process.exit(0);
