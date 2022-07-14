import AtlasNode from './nodes/AtlasNode';
import AtlasEdge from './edges/AtlasEdge';

export default class AtlasGraph {
	public name = 'atlas_graph';
	public readonly nodes: AtlasNode[] = [];
	public readonly edges: AtlasEdge[] = [];

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
