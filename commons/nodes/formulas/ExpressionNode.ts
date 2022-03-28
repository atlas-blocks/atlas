import FormulaNode from './FormulaNode';

class ExpressionNode extends FormulaNode {
	private precision: number;

	constructor(name: string, description: string, content: string, precision: number) {
		super(name, description, content);
		this.precision = precision;
	}
}

export default ExpressionNode;
