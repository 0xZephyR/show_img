export default class FetchUtil {
	constructor() {
		this.url = arguments[0];
		this.headers = null;
		this.content = null;
	}
	getUrl() {
		fetch(this.url).then((res) => res.text());
	}
}
