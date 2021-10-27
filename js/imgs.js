/* eslint-disable no-empty */
/* eslint-disable linebreak-style */
/* eslint-disable require-jsdoc */
import root from '../root.js';
export default class ImageSet {
	constructor(box, arr) {
		this.box = box;
		this.arr = arr;
		this.index = 0;
		this.loaded = 0;
		this.imgList = [];
		this.height = 0;
	}
	/**
	 * 从服务器请求图包名字
	 * @param {number} index :index of requested pack in the list
	 * @returns {string} name of the pack
	 */
	async myFetch() {
		let response = await fetch('./1.jpg');
		return await response.blob();
	}
	get(index) {
		let url = `http://localhost:8081/?index=${index}`;
		const xhr = new XMLHttpRequest();
		xhr.open('GET', url, false);
		xhr.send(null);
		const res = xhr.getResponseHeader('content');
		return decodeURIComponent(res);
	}
	/**
	 * @function
	 * @description 预加载图片
	 * @returns {void}
	 */
	preload() {
		for (let i = 0; i < 20; ++i) {
			let packName = this.get(this.index++);
			if (packName === 'too-long') {
				return;
			}
			const img = new Image();
			img.alt = packName;
			img.className = 'img';
			img.addEventListener('load', () => {
				this.imgList.push(img);
			});
			if (packName.includes('YeYe')) {
				console.log(packName);
			}
			img.src = `/${root}/${packName}/1.jpg`;
			if (packName.includes('YeYe')) {
				console.log(img.src);
			}
		}
	}
	addOneImg() {
		if (
			this.height -
				document.documentElement.scrollTop -
				document.documentElement.clientHeight >
			1000
		) {
			return false;
		}
		try {
			if (this.loaded >= this.imgList.length) {
				return false;
			}
		} catch (e) {
			console.error(e);
		}
		const div = document.createElement('DIV');
		const img = this.imgList[this.loaded++];
		const tag = document.createElement('A');
		const h3 = document.createElement('h5');
		div.dataset.name = img.alt;
		h3.appendChild(tag);
		tag.innerText = img.alt;
		tag.href = `/pack.html?pack=${img.alt}`.replace('&', '[[[');
		tag.target = '_blank';
		div.className = 'img-contain';
		div.appendChild(img);
		img.alt = '';
		div.appendChild(h3);
		this.box.appendChild(div);
		const height = div.getBoundingClientRect().height;
		let min = this.arr[0];
		let idx = 0;
		for (let i = 0; i < this.arr.length; i++) {
			// eslint-disable-next-line no-shadow
			const height = this.arr[i];
			if (height < min) {
				min = height;
				idx = i;
			}
		}
		div.style.top = `${this.arr[idx]}px`;
		div.style.left = `${220 * idx}px`;
		this.arr[idx] += height + 20;
		this.height = this.arr[idx];
		return true;
	}
	async addImgs() {
		new Promise((resolve, reject) => {
			if (this.imgList.length - this.loaded <= 30) {
				this.preload();
				setTimeout(() => {
					resolve();
				}, 200);
			} else {
				resolve();
			}
		}).then(() => {
			while (this.addOneImg()) {}
		});
	}
}
