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

	public static build() {
		return new AtlasEdge('', '');
	}
}

export class AtlasNode {
	static type: string = 'AtlasGraph.Node';
	public type: string;
	static uitype: string = AtlasNode.type;
	public uitype: string;
	public name: string;
	public position: [number, number];
	public visibility: boolean;

	constructor(
		type: string,
		name: string,
		uitype: string,
		position: [number, number],
		visibility: boolean,
	) {
		this.type = type;
		this.uitype = uitype;
		this.name = name;
		this.uitype = uitype;
		this.position = position;
		this.visibility = visibility;
	}

	public static build() {
		return new AtlasNode('', '', '', [0, 0], true).setDefaultName();
	}

	setDefaultName() {
		this.name = AtlasGraph.getDefaultName();
		return this;
	}

	getId() {
		return this.name;
	}

	public setType(type: string): AtlasNode {
		this.type = type;
		return this;
	}

	public setName(name: string): AtlasNode {
		this.name = name;
		return this;
	}

	public setPosition(x: number, y: number): AtlasNode {
		this.position = [x, y];
		return this;
	}
}

export class ContentNode extends AtlasNode {
	public content: string;

	constructor(node: AtlasNode, content: string) {
		super(node.type, node.name, node.uitype, node.position, node.visibility);
		this.content = content;
	}

	public static build() {
		return new TextNode(AtlasNode.build(), '');
	}

	public setContent(content: string): ContentNode {
		this.content = content;
		return this;
	}
}

export class TextNode extends ContentNode {
	static type = 'AtlasGraph.TextNode';
	static uitype = TextNode.type;

	constructor(node: AtlasNode, content: string) {
		super(node, content);
		this.type = TextNode.type;
		this.uitype = TextNode.uitype;
	}
}

export class FileNode extends AtlasNode {
	static type = 'AtlasGraph.FileNode';
	static uitype = FileNode.type;
	public content: string;
	public filename: string;

	constructor(node: AtlasNode, content: string, filename: string) {
		super(FileNode.type, node.name, FileNode.uitype, node.position, node.visibility);
		this.content = content;
		this.filename = filename;
	}

	public static build() {
		return new FileNode(AtlasNode.build(), '', '');
	}
}

export class ExpressionNode extends ContentNode {
	static type = 'AtlasGraph.ExpressionNode';
	static uitype = ExpressionNode.type;
	public result: string;

	constructor(node: AtlasNode, content: string, result: string) {
		super(node, content);
		this.type = ExpressionNode.type;
		this.uitype = ExpressionNode.uitype;
		this.result = result;
	}

	public static build() {
		return new ExpressionNode(AtlasNode.build(), '', '');
	}

	public static buildWithUitype(uitype: string) {
		switch (uitype) {
			case MatrixFilterNode.uitype:
				return MatrixFilterNode.build();
			default:
				return ExpressionNode.build();
		}
	}

	public setResult(result: string): ExpressionNode {
		this.result = result;
		return this;
	}
}

export class MatrixFilterNode extends ExpressionNode {
	static uitype: string = 'MatrixFilterNode';

	constructor(node: AtlasNode, content: string, result: string) {
		super(node, content, result);
		this.uitype = MatrixFilterNode.uitype;
	}

	public static build(): MatrixFilterNode {
		return new MatrixFilterNode(AtlasNode.build(), '', '');
	}
}
