/* eslint-disable linebreak-style */
/* eslint-disable require-jsdoc */
// eslint-disable-next-line linebreak-style
import root from '../root.js';
export default class Pack {
	constructor(name) {
		this.name = encodeURIComponent(name);
		this.length = 0;
	}
	get() {
		const xhr = new XMLHttpRequest();
		xhr.open('GET', `http://localhost:8081/?pack=${this.name}`, false);
		xhr.send(null);
		this.length = xhr.getResponseHeader('Length');
	}
	setImg() {
		const body = document.body;
		const show = document.createElement('DIV');
		show.className = 'show';
		body.insertBefore(show, body.firstChild);
		for (let i = 1; i <= this.length; ++i) {
			const contain = document.createElement('DIV');
			contain.className = 'img-contain inner-contain';
			contain.style.position = 'relative';
			const img = new Image();
			img.alt = '';
			img.className = 'inner-img';
			try {
				img.src = `/${root}/${this.name}/${i}.jpg`;
			} catch (e) {
				break;
			}
			contain.appendChild(img);
			show.appendChild(contain);
		}
	}
}
const url = window.location.href;
const params = url.split('?')[1].split('&');
let pack = params[0].split('=')[1];
pack = decodeURIComponent(pack).replace('[[[', '&');
document.title = pack;
const imgPack = new Pack(pack);
imgPack.get();
imgPack.setImg();
