import FormulaNode from './FormulaNode';
import { Position } from '../Node';
import Import from '../../namespaces/Import';

class ExpressionNode extends FormulaNode {
	private precision: number;

	constructor(name: string, content: string, precision: number) {
		super(name, content);
		this.precision = precision;
	}

	public getImport(): Import {
		return ExpressionNode.getImport();
	}

	public static getImport(): Import {
		return new Import('system', 'formulas', 'ExpressionNode');
	}

	public static getNewBlock(pos: Position) {
		return new ExpressionNode('', '', 0).setPosition(pos);
	}

	public evaluate() {
		this.setResult('result');
	}
}

export default ExpressionNode;
