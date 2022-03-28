import { Node } from '../Node';

export abstract class FormulaNode extends Node {
	private content: string;

	protected constructor(id: string, name: string, description: string, content: string) {
		super(id, name, description);
		this.content = content;
	}
}
