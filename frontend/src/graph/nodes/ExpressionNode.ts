import ContentNode from './ContentNode';

export default class ExpressionNode extends ContentNode {
	static ui_type = 'AtlasGraph.ExpressionNode';
	public error = 'nothing';
	public helper_contents: string[] = [];
	public ui_result = 'nothing';
	public helper_ui_results: string[] = [];

	constructor() {
		super();
		this.type = ExpressionNode.ui_type;
		this.ui_type = ExpressionNode.ui_type;
	}

	public static build(): ExpressionNode {
		return new ExpressionNode();
	}

	public setUiResult(result: string): ExpressionNode {
		this.ui_result = result;
		return this;
	}
}
