import FormulaNode from './FormulaNode';
import { Position } from '../Node';
import NodeTypeNames from '../NodeTypeNames';

class ExpressionNode extends FormulaNode {
	private precision: number;

	constructor(name: string, description: string, content: string, precision: number) {
		super(name, description, content);
		this.precision = precision;
	}

	public getType() {
		return NodeTypeNames['ExpressionNode'];
	}

	public static getNewBlock(pos: Position) {
		return new ExpressionNode('', 'some description', '', 0).setPosition(pos);
	}
}

export default ExpressionNode;
