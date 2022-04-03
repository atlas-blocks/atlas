import FormulaNode from './FormulaNode';
import Import from '../../namespaces/Import';

export type FunctionArgument = {
	name: string;
	type: string;
};

class FunctionNode extends FormulaNode {
	private readonly args: FunctionArgument[];
	private readonly returnType: string;

	constructor(name: string, content: string, args: FunctionArgument[], returnType: string) {
		super(name, content);
		this.args = args;
		this.returnType = returnType;
	}

	public getArgs() {
		return this.args;
	}

	public getImport(): Import {
		return new Import('system', 'formulas/functions', 'FunctionNode');
	}
	async call(args: string[]): Promise<string> {
		this.setResult('function result');
		return 'function result';
	}
}

export default FunctionNode;
