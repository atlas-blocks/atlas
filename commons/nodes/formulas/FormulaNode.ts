import Node from '../Node';
import Graph from '../../Graph';
import FormulaUtils from '../../../utils/algorithms/FormulaUtils';

abstract class FormulaNode extends Node {
	protected content: string;
	private result: string;

	protected constructor(name: string, content: string) {
		super(name);
		this.content = content;
		this.result = '';
	}

	public toLatex() {
		return this.content;
	}

	public setLatex(latex: string) {
		this.content = latex;
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
