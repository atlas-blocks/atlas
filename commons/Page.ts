import { Graph } from './Graph';
import { Namespace } from './namespaces/Namespace';
import { Import } from './namespaces/Import';

export class Page {

	graph: Graph;
	namespace: Namespace;
	imports: Import[];


	constructor(graph: Graph, namespace: Namespace, imports: Import[]) {
		this.graph = graph;
		this.namespace = namespace;
		this.imports = imports;
	}
}