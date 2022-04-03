import FormulaNode from './FormulaNode';
import { Position } from '../Node';
import Import from '../../namespaces/Import';

class ExpressionNode extends FormulaNode {
	private precision: number;

	constructor(name: string, description: string, content: string, precision: number) {
		super(name, content);
		this.precision = precision;
	}

	public getType(): string {
		return this.getImport().getNodeName();
	}

	public getImport(): Import {
		return new Import('system', 'formulas', 'ExpressionNode');
	}

	public static getNewBlock(pos: Position) {
		return new ExpressionNode('', 'some description', '', 0).setPosition(pos);
	}
}

export default ExpressionNode;
