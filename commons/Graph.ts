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

	public getNodeByIdOrNull(id: string) {
		const filtered = this.nodes.filter((node) => node.getId() === id);
		console.assert(filtered.length < 2);
		if (filtered.length == 1) return filtered[0];
		return null;
	}
}

export default Graph;
