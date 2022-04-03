import FormulaNode from '../FormulaNode';
import { Position } from '../../Node';
import ServerUtils from '../../../../utils/ServerUtils';
import NodeTypeNames from '../../NodeTypeNames';
//
// class SimplifyNode extends FormulaNode {
// 	formula: FormulaNode | undefined;
//
// 	constructor(name: string, formula: FormulaNode | undefined) {
// 		super(name, '');
// 		this.formula = formula;
// 	}
//
// 	public getType() {
// 		return NodeTypeNames['SimplifyNode'];
// 	}
//
// 	public async fetchLatexAsync(): Promise<void> {
// 		if (this.formula === undefined) {
// 			this.content = '\\text{no formula}';
// 			return;
// 		}
// 		const response = await ServerUtils.getElSimplify(this.formula.toLatex());
// 		this.content = response.success ? response.latex : '\\text{error during calculating}';
// 	}
//
// 	public getFormula() {
// 		return this.formula;
// 	}
//
// 	public setFormula(newFormula: FormulaNode | undefined) {
// 		this.formula = newFormula;
// 	}
//
// 	public getFormulaName(): string {
// 		return this.formula === undefined ? '' : this.formula.getName();
// 	}
//
// 	public static getNewBlock(pos: Position) {
// 		return new SimplifyNode('', undefined).setPosition(pos);
// 	}
//
// 	public getOutRefNodes(): FormulaNode[] {
// 		return this.formula == undefined ? [] : [this.formula];
// 	}
// }
//
// export default SimplifyNode;
