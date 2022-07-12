import ContentNode from './ContentNode';
export default class TextNode extends ContentNode {
	static ui_type = 'AtlasGraph.TextNode';

	constructor() {
		super();
		this.type = TextNode.ui_type;
		this.ui_type = TextNode.ui_type;
	}

	public static build(): TextNode {
		return new TextNode();
	}
}
