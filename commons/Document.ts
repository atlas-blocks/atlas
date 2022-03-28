import Page from './Page';

export class Document {
	private package: string;
	private pages: Page[];

	constructor(name: string) {
		this.package = '/system/' + name;
		this.pages = [new Page(this.package)];
	}

	public get getPackage() {
		return this.package;
	}

	public getPage(index: number) {
		console.assert(index < this.pages.length);
		return this.pages[index];
	}
}

export default Document;
