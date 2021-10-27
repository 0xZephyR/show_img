/* eslint-disable linebreak-style */
import ImageSet from './imgs.js';
import Search from './search.js';
const box = document.getElementById('container');
const arr = new Array(4);
for (let i = 0; i < arr.length; ++i) {
	arr[i] = 0;
}
const imgSetter = new ImageSet(box, arr);
window.addEventListener('load', () => {
	imgSetter.addImgs();
});
window.addEventListener('mousewheel', () => {
	if (box.style.display === 'flex') {
		imgSetter.addImgs();
	}
});

const search = document.getElementById('search-box');
const searchContainer = document.getElementById('search-container');
const a = [0, 0, 0, 0];
const Searcher = new Search(searchContainer, a);
search.addEventListener('keydown', ({ keyCode }) => {
	if (keyCode === 13 && search.value !== '') {
		for (let x = searchContainer.childNodes.length - 1; x >= 0; --x) {
			searchContainer.removeChild(searchContainer.childNodes[x]);
		}
		box.style.display = 'none';
		searchContainer.style.display = 'flex';
		Searcher.getResult(search.value);
		Searcher.addImgs();
	}
});
search.addEventListener('change', () => {
	if (search.value === '') {
		for (let x = searchContainer.childNodes.length - 1; x >= 0; --x) {
			searchContainer.removeChild(searchContainer.childNodes[x]);
		}
		searchContainer.style.display = 'none';
		box.style.display = 'flex';
	}
});
window.addEventListener('mousewheel', () => {
	if (searchContainer.style.display === 'flex') {
		Searcher.addImgs();
	}
});
