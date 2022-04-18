export default class AtlasGraph {

	public readonly nodes: AtlasNode[];

	constructor() {
		this.nodes = [];
	}
    static nameCnt = 0;
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

	setPosition(x: number, y: number): AtlasNode {
		this.position = [x, y];
		return this;
	}
    setDefaultName() {
        this.name = 'b' + AtlasGraph.nameCnt++;
        return this;
    }
}

export class ExpressionNode extends AtlasNode {
	static structType = 'AtlasGraph.ExpressionNode';
	public content: string;
	public result: string;

	constructor(node: AtlasNode, content: string, result: string) {
		super(node.type, node.name, node.package, node.position, node.visibility);
		this.content = content;
		this.result = result;
	}

	setPosition(x: number, y: number): AtlasNode {
		this.position = [x, y];
		return this;
	}
}
