import FormulaNode from '../FormulaNode';
import Import from '../../../namespaces/Import';

export type FunctionArgument = {
	name: string;
	type: string;
};

class FunctionNode extends FormulaNode {
	private readonly args: FunctionArgument[];

	constructor(name: string, content: string, args: FunctionArgument[]) {
		super(name, content);
		this.args = args;
	}

	public getArgs() {
		return this.args;
	}

	evaluate() {
		this.setResult('result');
	}

	public getImport(): Import {
		return new Import('system', 'formulas/functions', 'FunctionNode');
	}
}

export default FunctionNode;
