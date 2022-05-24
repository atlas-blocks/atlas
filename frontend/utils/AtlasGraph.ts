export default class AtlasGraph {
	public readonly nodes: AtlasNode[];
	public readonly edges: AtlasEdge[];

	constructor() {
		this.nodes = [];
		this.edges = [];
	}
	private static nameCnt = 0;
	static getDefaultName() {
		return 'b' + this.nameCnt++;
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
	public static constructorEmpty() {
		return new AtlasEdge('', '');
	}
}

export class AtlasNode {
	static structType = 'AtlasGraph.Node';
	public type: string;
	public name: string;
	public package: string;
	public position: [number, number];
	public visibility: boolean;

	constructor(
		type: string,
		name: string,
		pkg: string,
		position: [number, number],
		visibility: boolean,
	) {
		this.type = type;
		this.name = name;
		this.package = pkg;
		this.position = position;
		this.visibility = visibility;
	}
	public static constructorEmpty() {
		return new AtlasNode('', '', '', [0, 0], false);
	}

	setPosition(x: number, y: number): AtlasNode {
		this.position = [x, y];
		return this;
	}
	setDefaultName() {
		this.name = AtlasGraph.getDefaultName();
		return this;
	}
	getId() {
		return this.package + '/' + this.name;
	}
}

export class ContentNode extends AtlasNode {
	public content: string;

	constructor(node: AtlasNode, content: string) {
		super(node.type, node.name, node.package, node.position, node.visibility);
		this.content = content;
	}

	public static constructorEmpty() {
		return new TextNode(AtlasNode.constructorEmpty(), '');
	}
}

export class TextNode extends ContentNode {
	static structType = 'AtlasGraph.TextNode';
}

export class ExpressionNode extends ContentNode {
	static structType = 'AtlasGraph.ExpressionNode';
	public result: string;

	constructor(node: AtlasNode, content: string, result: string) {
		super(node, content);
		this.result = result;
	}

	public static constructorEmpty() {
		return new ExpressionNode(AtlasNode.constructorEmpty(), '', '');
	}
}
