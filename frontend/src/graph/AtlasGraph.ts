export default class AtlasGraph {
	public name: string;
	public readonly nodes: AtlasNode[];
	public readonly edges: AtlasEdge[];

	constructor() {
		this.name = '';
		this.nodes = [];
		this.edges = [];
	}

	public replaceWithNew(newGraph: AtlasGraph): void {
		this.setName(newGraph.name).setNodes(newGraph.nodes).setEdges(newGraph.edges);
	}

	public setName(name: string): AtlasGraph {
		this.name = name;
		return this;
	}

	public setNodes(nodes: AtlasNode[]): AtlasGraph {
		this.nodes.splice(0, this.nodes.length);
		this.nodes.push(...nodes);
		return this;
	}

	public setEdges(edges: AtlasEdge[]): AtlasGraph {
		this.edges.splice(0, this.edges.length);
		this.edges.push(...edges);
		return this;
	}

	private isInDefaultNameFormat(name: string) {
		return name[0] === 'b' && !isNaN(Number(name.slice(1)));
	}

	public getDefaultName() {
		const defaultNodesNameNumbers: number[] = this.nodes
			.filter((node) => this.isInDefaultNameFormat(node.name))
			.map((node) => Number(node.name.slice(1)));
		return 'b' + (Math.max(...defaultNodesNameNumbers, 0) + 1);
	}

	public removeById(id: string) {
		const nodeToRemove = this.getById(id);
		this.nodes.splice(this.nodes.indexOf(nodeToRemove), 1);
	}

	getByName(name: string): AtlasNode[] {
		return this.nodes.filter((node) => node.name === name);
	}

	getById(id: string): AtlasNode {
		const nodes = this.nodes.filter((node) => node.getId() === id);
		console.assert(nodes.length == 1);
		return nodes[0];
	}
}

export class AtlasEdge {
	public to: string;
	public from: string;

	constructor(to: string, from: string) {
		this.to = to;
		this.from = from;
	}

	public static build() {
		return new AtlasEdge('', '');
	}
}

export class AtlasNode {
	static uitype = 'AtlasGraph.Node';

	public name: string;
	public type: string;
	public uitype: string;
	public position: [number, number];
	public visibility: boolean;

	constructor() {
		this.name = '';
		this.type = AtlasNode.uitype;
		this.uitype = AtlasNode.uitype;
		this.position = [0, 0];
		this.visibility = true;
	}

	public static build(): AtlasNode {
		return new AtlasNode();
	}

	public setDefaultName(graph: AtlasGraph): AtlasNode {
		this.name = graph.getDefaultName();
		return this;
	}

	public getId(): string {
		return this.name;
	}

	/**
	 * Json representation of each node have so-called uidata field.
	 * This field contains all the ui information, that backend don't need
	 * to know of, like `visibility` or `position`.
	 *
	 * Children must override this method, if they have more ui-specific fields!
	 */
	public getUiData(): object {
		return {
			uitype: this.uitype,
			position: this.position,
			visibility: this.visibility,
		};
	}

	public setName(name: string): AtlasNode {
		this.name = name;
		return this;
	}

	public setUitype(visibility: boolean): AtlasNode {
		this.visibility = visibility;
		return this;
	}

	public setPosition(x: number, y: number): AtlasNode {
		this.position = [x, y];
		return this;
	}

	public setVisibility(visibility: boolean): AtlasNode {
		this.visibility = visibility;
		return this;
	}
}

export class ContentNode extends AtlasNode {
	public content: string;

	constructor() {
		super();
		this.content = '';
	}

	public setContent(content: string): ContentNode {
		this.content = content;
		return this;
	}
}

export class TextNode extends ContentNode {
	static uitype = 'AtlasGraph.TextNode';

	constructor() {
		super();
		this.type = TextNode.uitype;
		this.uitype = TextNode.uitype;
	}

	public static build(): TextNode {
		return new TextNode();
	}
}

export class FileNode extends TextNode {
	static uitype = 'AtlasGraph.FileNode';
	public filename: string;

	constructor() {
		super();
		this.uitype = FileNode.uitype;
		this.filename = '';
	}

	public static build(): FileNode {
		return new FileNode();
	}

	public getUiData(): object {
		return { ...super.getUiData(), filename: this.filename };
	}

	public setFilename(filename: string): FileNode {
		this.filename = filename;
		return this;
	}
}

export class ExpressionNode extends ContentNode {
	static uitype = 'AtlasGraph.ExpressionNode';
	public result: string;
	public error: string;
	public helper_contents: string[];
	public helper_results: string[];

	constructor() {
		super();
		this.type = ExpressionNode.uitype;
		this.uitype = ExpressionNode.uitype;
		this.result = 'nothing';
		this.error = 'nothing';
		this.helper_contents = [];
		this.helper_results = [];
	}

	public static build(): ExpressionNode {
		return new ExpressionNode();
	}

	public setResult(result: string): ExpressionNode {
		this.result = result;
		return this;
	}
}

export class MatrixFilterNode extends ExpressionNode {
	static uitype = 'AtlasGraph.MatrixFilterNode';

	constructor() {
		super();
		this.uitype = MatrixFilterNode.uitype;
	}

	public static build(): MatrixFilterNode {
		return new MatrixFilterNode();
	}
}

export class SelectionNode extends ExpressionNode {
	static uitype = 'AtlasGraph.SelectionNode';
	public source: string;
	public selectedOption: number;

	constructor() {
		super();
		this.uitype = SelectionNode.uitype;
		this.selectedOption = 1;
		this.source = '';
		this.setContent('');
		this.helper_results = ['[]'];
	}

	public getOptions(): string[] {
		try {
			const options = JSON.parse(this.helper_results[0]);
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

	public getUiData(): object {
		return { ...super.getUiData(), source: this.source };
	}

	public static build(): SelectionNode {
		return new SelectionNode();
	}
}

export class ObjectNode extends ExpressionNode {
	static uitype = 'AtlasGraph.ObjectNode';
	public objProperties: [string, string][];

	constructor() {
		super();
		this.uitype = ObjectNode.uitype;
		this.setContent('');
		this.objProperties = [['', '']];
	}

	private updateContent() {
		let newContent = 'Dict(';
		this.objProperties.forEach((prop) => (newContent += `"${prop[0]}" => ${prop[1]},`));
		newContent = newContent.slice(0, newContent.length - 1) + ')';
		this.content = newContent;
	}

	public setObjProperties(properties: [string, string][]): ObjectNode {
		this.objProperties = properties;
		this.updateContent();
		return this;
	}

	public getUiData(): object {
		return { ...super.getUiData(), objProperties: this.objProperties };
	}

	public static build(): ObjectNode {
		return new ObjectNode();
	}
}
