import Node from '../Node';

abstract class FormulaNode extends Node {
	protected content: string;

	protected constructor(name: string, content: string) {
		super(name);
		this.content = content;
	}

	public toLatex() {
		return this.content;
	}

	public setLatex(latex: string) {
		this.content = latex;
	}
}

export default FormulaNode;
