import Namespace from './Namespace';
import Graph from '../Graph';
import ConstantNode from '../nodes/formulas/values/ConstantNode';

class GraphNamespace implements Namespace {
	package: string;
	graph: Graph;

	constructor(packageName: string, graph: Graph) {
		this.package = packageName;
		this.graph = graph;
	}

	getConstants(): ConstantNode[] {
		return [];
	}
}

export default GraphNamespace;
