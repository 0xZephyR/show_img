import crawl from './website.js';
function sleep(interval) {
	const start = new Date();
	while (Date.now() - start <= interval * 1000) {}
}
async function f(page) {
	await crawl.getPacksURLInPage(page);
	while (crawl.packs.length > 0) {
		crawl.getImages(crawl.packs.shift()).then((v) => {
			if (v.title.length === 0) {
				console.log(v.title + ' no src');
				return;
			}
			try {
				crawl.downloadImages(v);
				let _ = '';
				for (let i = 0; i < 100 - v.title.length; ++i) {
					_ += '-';
				}
				console.log(v.title + '      ' + _ + page);
			} catch (err) {
				console.log(v.title + '   ' + v.imgList.length + '  error');
				console.log(v.imgList);
				console.error(err);
			}
		});
	}
}
async function g() {
	for (let i = 1; i < 45; ++i) {
		f(i);
	}
}
let index = 1;
let id = setInterval(() => {
	f(index++);
	if (index === 124) {
		clearInterval(id);
	}
}, 1000);
