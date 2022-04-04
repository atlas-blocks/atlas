import Node from './nodes/Node';

class Graph {
	private readonly nodes: Node[];

	constructor() {
		this.nodes = [];
	}

	public getNodes() {
		return this.nodes;
	}

	public addNode(node: Node) {
		this.nodes.push(node);
	}

	public addNodes(nodes: Node[]) {
		for (const node of nodes) this.addNode(node);
	}

	public getNodeByIdOrNull(id: string): Node | null {
		const filtered = this.nodes.filter((node) => node.getId() === id);
		console.assert(filtered.length < 2);
		if (filtered.length == 1) return filtered[0];
		return null;
	}

	public getNodeByNameOrNull(name: string): Node | null {
		const filtered = this.nodes.filter((node) => node.getName() === name);
		console.assert(filtered.length < 2);
		if (filtered.length == 1) return filtered[0];
		return null;
	}

	public getNodesByName(name: string): Node[] {
		return this.nodes.filter((node) => node.getName() === name);
	}

	public getNodesByNameAndClassType<T extends Node>(name: string, classType: Function): T[] {
		return this.getNodesByName(name).filter((node) => node instanceof classType) as T[];
	}
}

export default Graph;
