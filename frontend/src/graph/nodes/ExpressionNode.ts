import ContentNode from './ContentNode';

export type ResultPart = {
	'text/plain'?: string;
	'text/html'?: string;
};
export type ExecutionError = {
	value: string;
	traceback: string[];
};
export class ExecutionResponse {
	result: ResultPart[] = [];
	error: ExecutionError | null = null;

	public getPlainTextResultString(): string {
		return this.result.map((result) => result['text/plain']).join('');
	}

	public setResult(result: ResultPart[]): ExecutionResponse {
		this.result = result;
		return this;
	}

	public setPlainTextResult(result: string): ExecutionResponse {
		return this.setResult([{ 'text/plain': result }]);
	}

	public setError(error: ExecutionError): ExecutionResponse {
		this.error = error;
		return this;
	}
}

export default class ExpressionNode extends ContentNode {
	static ui_type = 'AtlasGraph.ExpressionNode';

	public response: ExecutionResponse | null = null;
	public helper_contents: string[] = [];
	public helper_responses: ExecutionResponse[] = [];
	public providerNames: string[] = [];

	constructor() {
		super();
		this.type = ExpressionNode.ui_type;
		this.ui_type = ExpressionNode.ui_type;
	}

	public static build(): ExpressionNode {
		return new ExpressionNode();
	}

	public getResult(): ResultPart[] | null {
		return this.response === null ? null : this.response.result;
	}

	public getError(): ExecutionError | null {
		return this.response === null ? null : this.response.error;
	}

	public getPlainTextResultString(): string {
		if (this.response === null) return '';
		return this.response.getPlainTextResultString();
	}

	public setResult(result: ResultPart[]): ExpressionNode {
		this.response = new ExecutionResponse();
		this.response.setResult(result);
		return this;
	}

	public setPlainTextResult(result: string): ExpressionNode {
		return this.setResult([{ 'text/plain': result }]);
	}
}
