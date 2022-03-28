import Graph from './Graph';
import Import from './namespaces/Import';
import GraphNamespace from './namespaces/GraphNamespace';
import Namespace from './namespaces/Namespace';

class Page {
	private graph: Graph;
	namespace: Namespace;
	imports: Import[];

	constructor(packageName: string) {
		this.graph = new Graph();
		this.namespace = new GraphNamespace(packageName, this.graph);
		this.imports = [];
	}

	public getGraph() {
		return this.graph;
	}
}

export default Page;
