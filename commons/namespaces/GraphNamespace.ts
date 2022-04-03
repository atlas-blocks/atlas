import Namespace from './Namespace';
import Graph from '../Graph';

class GraphNamespace implements Namespace {
	package: string;
	graph: Graph;

	constructor(packageName: string, graph: Graph) {
		this.package = packageName;
		this.graph = graph;
	}
}

export default GraphNamespace;
