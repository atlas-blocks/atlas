import AtlasNode from './AtlasNode';

export default class ContentNode extends AtlasNode {
	public content = '';

	public setContent(content: string): ContentNode {
		this.content = content;
		return this;
	}
}
