import FormulaNode from './FormulaNode';

class SimplifyNode extends FormulaNode {
	formula: FormulaNode;

	constructor(name: string, formula: FormulaNode) {
		super(name, '', '');
		this.formula = formula;
	}

	public toLatex(): string {
		return 'simplify';
	}
}

export default SimplifyNode;
