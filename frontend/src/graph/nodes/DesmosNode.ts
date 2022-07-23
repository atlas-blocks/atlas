import ExpressionNode from './ExpressionNode';

export default class DesmosNode extends ExpressionNode {
	static ui_type = 'AtlasGraph.DesmosNode';

	constructor() {
		super();
		this.content = '""';
		this.ui_type = DesmosNode.ui_type;
	}

	public setContent(content: string): DesmosNode {
		this.content = content;
		this.helper_contents = [`print(${this.content})`];
		return this;
	}

	public static build(): DesmosNode {
		return new DesmosNode();
	}
}
