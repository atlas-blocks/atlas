import FormulaNode from './FormulaNode';
import { Position } from '../Node';
import { ServerUtils } from '../../../utils/ServerUtils';
import NodeTypeNames from '../NodeTypeNames';

class SimplifyNode extends FormulaNode {
	formula: FormulaNode | undefined;

	constructor(name: string, formula: FormulaNode | undefined) {
		super(name, '', '');
		this.formula = formula;
	}

	public getType() {
		return NodeTypeNames['SimplifyNode'];
	}

	public async fetchLatexAsync(callback: () => any) {
		if (this.formula === undefined) return '\\text{no formula}';
		return ServerUtils.getSimplify(this.formula.toLatex())
			.then((response) => (this.content = response.latex))
			.then(callback());
	}

	public getFormula() {
		return this.formula;
	}

	public setFormula(newFormula: FormulaNode) {
		this.formula = newFormula;
	}

	public getFormulaName(): string {
		return this.formula === undefined ? '' : this.formula.getName();
	}

	public static getNewBlock(pos: Position) {
		return new SimplifyNode('', undefined).setPosition(pos);
	}

	public getOutRefNodes(): FormulaNode[] {
		return this.formula == undefined ? [] : [this.formula];
	}
}

export default SimplifyNode;
