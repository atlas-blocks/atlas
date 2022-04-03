import FunctionNode, { FunctionArgument } from './FunctionNode';
import Import from '../../../namespaces/Import';

class JavaScriptFunctionNode extends FunctionNode {
	private readonly func: (args: string[]) => Promise<string>;

	constructor(
		name: string,
		func: (args: string[]) => Promise<string>,
		args: FunctionArgument[],
		returnType: string,
	) {
		super(name, '', args, returnType);
		this.func = func;
	}

	async call(args: string[]): Promise<string> {
		console.assert(args.length === this.getArgs().length);
		const result = await this.func(args);
		this.setResult(result);
		return result;
	}

	public getImport(): Import {
		return JavaScriptFunctionNode.getImport();
	}

	public static getImport(): Import {
		return new Import('system', 'formulas/functions', 'JavaScriptFunctionNode');
	}
}

export default JavaScriptFunctionNode;
