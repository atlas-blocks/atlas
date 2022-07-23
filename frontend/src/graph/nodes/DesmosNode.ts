import TextNode from './TextNode';

export default class DesmosNode extends TextNode {
	static ui_type = 'AtlasGraph.DesmosNode';

	constructor() {
		super();
		this.content = '';
		this.ui_type = DesmosNode.ui_type;
	}

	public static build(): DesmosNode {
		return new DesmosNode();
	}
}
