import ContentNode from './ContentNode';

export default class ExpressionNode extends ContentNode {
	static ui_type = 'AtlasGraph.ExpressionNode';
	public result: string;
	public error: string;
	public helper_contents: string[];
	public helper_results: string[];

	constructor() {
		super();
		this.type = ExpressionNode.ui_type;
		this.ui_type = ExpressionNode.ui_type;
		this.result = 'nothing';
		this.error = 'nothing';
		this.helper_contents = [];
		this.helper_results = [];
	}

	public static build(): ExpressionNode {
		return new ExpressionNode();
	}

	public setResult(result: string): ExpressionNode {
		this.result = result;
		return this;
	}
}
