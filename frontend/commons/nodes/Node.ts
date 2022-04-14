import Import from '../namespaces/Import';
import Graph from '../Graph';

export type Position = {
	x: number;
	y: number;
};

abstract class Node {
	private static cnt = 0;
	private readonly id: string;
	private readonly name: string;
	private readonly description: string;
	private position: Position;
	private visible: boolean;

	protected constructor(name: string) {
		this.id = Node.cnt.toString();
		++Node.cnt;
		this.name = name != '' ? name : 'b' + this.id;
		this.description = '';
		this.visible = false;
		this.position = { x: 0, y: 0 };
	}

	public getImport() {
		return Node.getImport();
	}

	public static getImport() {
		return new Import('system', '', 'Node');
	}

	public getId() {
		return this.id;
	}

	public getName() {
		return this.name;
	}

	public getDescription() {
		return this.description;
	}

	public getPosition() {
		return this.position;
	}

	public setPosition(pos: Position) {
		this.visible = true;
		this.position = pos;
		return this;
	}
	public isVisible() {
		return this.visible;
	}

	public setVisible(visibility: boolean) {
		this.visible = visibility;
		return this;
	}

	public getProviderNodes(graph: Graph): Node[] {
		return [];
	}

	public getUserNodes(graph: Graph): Node[] {
		const userNodes: Node[] = [];
		for (const node of graph.getNodes()) {
			if (node.getProviderNodes(graph).includes(this)) userNodes.push(node);
		}
		return userNodes;
	}
}

export default Node;
