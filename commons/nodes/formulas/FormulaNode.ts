import Node from '../Node';

abstract class FormulaNode extends Node {
	protected content: string;
	private result: string;

	protected constructor(name: string, content: string) {
		super(name);
		this.content = content;
		this.result = '';
	}

	public getContent(): string {
		return this.content;
	}

	public getResult(): string {
		return this.result;
	}

	protected setResult(result: string) {
		this.result = result;
	}
}

export default FormulaNode;
