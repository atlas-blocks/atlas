import AtlasNode from './AtlasNode';

export default class ContentNode extends AtlasNode {
	public content: string;

	constructor() {
		super();
		this.content = '';
	}

	public setContent(content: string): ContentNode {
		this.content = content;
		return this;
	}
}
