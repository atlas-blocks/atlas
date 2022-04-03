import FunctionNode, { FunctionArgument } from './FunctionNode';
import Import from '../../../namespaces/Import';

class JavaScriptFunctionNode extends FunctionNode {
	private readonly func: (args: string[]) => string;

	constructor(name: string, func: (args: string[]) => string, args: FunctionArgument[]) {
		super(name, '', args);
		this.func = func;
	}

	call(args: string[]) {
		console.assert(args.length === this.getArgs().length);
		this.setResult(this.func(args));
	}

	public getImport(): Import {
		return JavaScriptFunctionNode.getImport();
	}

	public static getImport(): Import {
		return new Import('system', 'formulas/functions', 'JavaScriptFunctionNode');
	}
}

export default JavaScriptFunctionNode;
