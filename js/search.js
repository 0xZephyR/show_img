/* eslint-disable linebreak-style */
/* eslint-disable require-jsdoc */
/* eslint-disable linebreak-style */
import ImageSet from './imgs.js';

export default class Search extends ImageSet {
	constructor(box, arr) {
		super(box, arr);
		this.result = [];
	}
	getResult(value) {
		this.arr = [0, 0, 0, 0];
		this.imgList = [];
		this.loaded = 0;
		this.height = 0;
		this.index = 0;
		const xhr = new XMLHttpRequest();
		xhr.open('GET', `http://localhost:8081/?search=${value}`, false);
		xhr.send(null);
		const res = xhr.getResponseHeader('Search-Result').split('/');
		this.result = res.slice(0, res.length - 1);
	}
	preload() {
		for (; this.index < this.result.length; ++this.index) {
			const packName = this.get(this.result[this.index]);
			const img = new Image();
			img.alt = packName;
			img.className = 'img';
			img.addEventListener('load', () => {
				this.imgList.push(img);
			});
			img.src = `/图片/${packName}/1.jpg`;
		}
	}
}
