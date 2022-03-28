import FormulaNode from './FormulaNode';

class ExpressionNode extends FormulaNode {
	private precision: number;

	constructor(id: string, name: string, description: string, content: string, precision: number) {
		super(id, name, description, content);
		this.precision = precision;
	}
}

export default ExpressionNode;
