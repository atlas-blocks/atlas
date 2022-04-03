import Node from '../Node';
import { ArrayStack } from '../../../utils/data_sturctures/Stack';

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

	public getContent(): String {
		return this.content;
	}
}

export default FormulaNode;
