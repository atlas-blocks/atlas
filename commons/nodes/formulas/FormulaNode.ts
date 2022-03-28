import Node from '../Node';

abstract class FormulaNode extends Node {
	protected content: string;

	protected constructor(name: string, description: string, content: string) {
		super(name, description);
		this.content = content;
	}

	public toLatex() {
		return this.content;
	}
}

export default FormulaNode;
