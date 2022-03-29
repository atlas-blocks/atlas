import FormulaNode from './FormulaNode';

class SimplifyNode extends FormulaNode {
	formula: FormulaNode;

	constructor(name: string, formula: FormulaNode) {
		super(name, '', '');
		this.formula = formula;
	}

	public toLatex(): string {
		return 'bahaha';
	}

	public getFormula() {
		return this.formula;
	}
}

export default SimplifyNode;
