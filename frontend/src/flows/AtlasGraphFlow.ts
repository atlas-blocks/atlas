import Flow from './Flow';
import AtlasGraph from '../graph/AtlasGraph';

export default class AtlasGraphFlow extends Flow {
	graph: AtlasGraph;

	constructor(graph: AtlasGraph) {
		super();
		this.graph = graph;
	}

	public getId() {
		return this.graph.name;
	}

	public getName() {
		return this.graph.name;
	}
}
