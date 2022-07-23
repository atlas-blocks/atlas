import AtlasNode from './AtlasNode';

export default class ContentNode extends AtlasNode {
	protected content = '';

	public setContent(content: string): ContentNode {
		this.content = content;
		return this;
	}

	public getContent(): string {
		return this.content;
	}
}
