import Namespace from './Namespace';
import Node from '../nodes/Node';
import Graph from '../Graph';

class GraphNamespace implements Namespace {
	private package: string;
	private graph: Graph;

	constructor(packageName: string, graph: Graph) {
		this.package = packageName;
		this.graph = graph;
	}

	getGraph() {
		return this.graph;
	}
	getPackage(): string {
		return this.package;
	}

	getNodeByNameOrNull(name: string): Node | null {
		return this.graph.getNodeByNameOrNull(name);
	}

	getAllNodes(): Node[] {
		return this.graph.getNodes();
	}
}

export default GraphNamespace;
