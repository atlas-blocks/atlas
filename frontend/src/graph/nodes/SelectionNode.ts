import ExpressionNode from './ExpressionNode';

export default class SelectionNode extends ExpressionNode {
	static ui_type = 'AtlasGraph.SelectionNode';
	public source = '';
	public selectedOption = 1;

	constructor() {
		super();
		this.ui_type = SelectionNode.ui_type;
		this.setContent('');
		this.helper_ui_results = ['[]'];
	}

	public getOptions(): string[] {
		try {
			const options = JSON.parse(this.helper_ui_results[0]);
			if (Array.isArray(options)) return options;
		} catch (ignored) {
			// if options is not json array, then it's user's fault and we can ignore it
		}
		return [];
	}

	private updateContent() {
		this.content = this.source === '' ? '' : this.source + '[' + this.selectedOption + ']';
		this.helper_contents = [
			// `JSON3.write(map(val -> sprint(show, "text/plain", val), ${
			`JSON3.write(repr.(${this.source === '' ? '[]' : this.source}))`,
		];
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
