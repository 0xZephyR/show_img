import cheerio from 'cheerio';
import fs from 'fs';
import request from 'request';
const root = './少女';
const packs = [];
// 获取网站每一页上的图包的url
export function getPacksURLInPage(page) {
	return new Promise((resolve, reject) => {
		request.get(
			{ url: `https://18tutu.com/category/ssyli/page/${page}` },
			function (error, res, body) {
				//res.statusCode 为200则表示链接成功
				if (error === null && res.statusCode === 200) {
					//使用cheerio来解析body（网页内容），提取我们想要的信息
					let $ = cheerio.load(body);
					let titles = $('a[rel=bookmark]');
					for (let e of titles) {
						let title = e.firstChild.data;
						let href = e.attribs.href;
						if (!fs.readdirSync(`./${root}`).includes(title)) {
							packs.push({ title, href });
						}
					}
					resolve(packs);
				} else {
					console.error(error);
				}
			}
		);
	});
}
async function getImagesInPage(url, index, imgList) {
	return new Promise((resolve, reject) => {
		request.get({ url: url + index }, function (error, res, body) {
			//res.statusCode 为200则表示链接成功
			if (error === null && res.statusCode === 200) {
				//使用cheerio来解析body（网页内容），提取我们想要的信息
				let $ = cheerio.load(body);
				let imgContain = $('p[class=nextpage]')[0];
				if (!imgContain) {
					imgContain = $('.yarpp')[0];
				}
				for (let e of imgContain.prev.prev.children) {
					if (e.name !== 'img') {
						continue;
					}
					if (e.attribs.src) {
						let s = e.attribs.src;
						if (s.endsWith('txt')) {
							continue;
						}
						if (s.endsWith('.jpg') || s.endsWith('.png')) {
							imgList.push(s);
						}
					}
				}
				//console.log(imgContain.prev.prev.children[0].attribs.src);
				resolve();
			} else {
				console.error(error);
			}
		});
	});
}
/**
 *
 * @param {{title:string, href: string}} pack
 */
export async function getImages(pack) {
	const p = [];
	let length = 0;
	const imgList = [];
	await new Promise((resolve) => {
		request.get({ url: pack.href }, function (error, res, body) {
			//res.statusCode 为200则表示链接成功
			if (error === null && res.statusCode === 200) {
				//使用cheerio来解析body（网页内容），提取我们想要的信息
				let $ = cheerio.load(body);
				let titles = $('a[class=post-page-numbers]');
				length = titles.length + 1;
				let imgContain = $('p[class=nextpage]')[0];
				if (!imgContain) {
					imgContain = $('.yarpp')[0];
				}
				for (let e of imgContain.prev.prev.children) {
					if (e.attribs.src) {
						let s = e.attribs.src;
						if (s.endsWith('.jpg') || s.endsWith('.png')) {
							imgList.push(s);
						}
					}
				}
				resolve();
			} else {
				console.error(error);
			}
		});
	});
	//console.log('done');
	try {
		for (let i = 2; i <= length; ++i) {
			p.push(getImagesInPage(pack.href, i, imgList));
		}
	} catch (err) {
		console.log(pack.title + '   err');
		console.error(err);
	}
	await Promise.all(p);
	let title = pack.title;
	return Promise.resolve({ imgList, title });
}

export async function getPages(start, end) {
	const promises = [];
	for (let i = start; i <= end; ++i) {
		promises.push(getPacksURLInPage(i));
	}
	await Promise.all(promises);
}
// 获取每个图包每一页的url
export function downloadImages(pack) {
	let index = 1;
	try {
		fs.mkdirSync(`./${root}/${pack.title}`);
	} catch (err) {
		return;
	}
	for (let img of pack.imgList) {
		try {
			request({ uri: img })
				.on('error', (err) => {
					console.error(err);
					console.log(pack.title);
					console.log(img);
				})
				.pipe(
					fs
						.createWriteStream(
							`./${root}/${pack.title}/${index++}.jpg`,
							{
								autoClose: true
							}
						)
						.on('error', (err) => {
							console.error(err);
							console.log(pack.title);
						})
						.on('finish', () => {})
						.on('close', (err) => {
							if (err) {
								console.log('写入失败', err);
							}
						})
				);
		} catch (error) {
			console.error(error);
			console.log(pack.title + ' ' + img + ' download Error');
		}
	}
}
export default { getPacksURLInPage, packs, getImages, downloadImages };
