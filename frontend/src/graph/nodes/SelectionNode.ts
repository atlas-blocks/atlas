import ExpressionNode, { ExecutionResponse } from './ExpressionNode';

export default class SelectionNode extends ExpressionNode {
	static ui_type = 'AtlasGraph.SelectionNode';
	public source = '';
	public selectedOption = 1;

	constructor() {
		super();
		this.ui_type = SelectionNode.ui_type;
		this.setContent('');
		this.helper_responses = [new ExecutionResponse().setPlainTextResult('[]')];
	}

	public getOptions(): string[] {
		try {
			const options = JSON.parse(this.helper_responses[0].getPlainTextResultString());
			if (Array.isArray(options)) return options;
		} catch (ignored) {
			// if options is not json array, then it's user's fault and we can ignore it
		}
		return [];
	}

	private updateContent(): void {
		if (this.source === '') {
			this.content = '';
			this.helper_contents = ['print([])'];
		}
		this.content = this.source + '[' + this.selectedOption + ']';
		this.helper_contents = [`import JSON3;\nprint(JSON3.write(repr.(${this.source})))`];
	}

	public setSource(source: string): SelectionNode {
		this.source = source;
		this.updateContent();
		return this;
	}

	public setSelectedOption(option: number): SelectionNode {
		this.selectedOption = option;
		this.updateContent();
		return this;
	}

	public static build(): SelectionNode {
		return new SelectionNode();
	}
}
