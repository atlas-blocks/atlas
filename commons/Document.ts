import { Page } from './Page';

export class Document {
	private pages: Page[]


	constructor(pages: Page[]) {
		this.pages = pages;
	}
}
