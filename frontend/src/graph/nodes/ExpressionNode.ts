import ContentNode from './ContentNode';

export type Result = {
	'text/plain'?: string;
	'text/html'?: string;
};

export default class ExpressionNode extends ContentNode {
	static ui_type = 'AtlasGraph.ExpressionNode';
	public error = 'nothing';
	public helper_contents: string[] = [];
	public result: Result = {};
	public helper_results: string[] = [];
	public execution_count = -1;

	constructor() {
		super();
		this.type = ExpressionNode.ui_type;
		this.ui_type = ExpressionNode.ui_type;
	}

	public static build(): ExpressionNode {
		return new ExpressionNode();
	}

	public setResult(result: Result): ExpressionNode {
		this.result = result;
		return this;
	}

	public setPlainTextResult(result: string): ExpressionNode {
		this.result = { 'text/plain': result };
		return this;
	}
}
