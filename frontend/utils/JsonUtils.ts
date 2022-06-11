import AtlasGraph from './AtlasGraph';
import ServerUtils from './ServerUtils';

export default class JsonUtils {
	public static jsonToGraph(graphJson: {
		name: string;
		nodes: { type: string; uitype: string }[];
		edges: object[];
	}): AtlasGraph {
		const graph: AtlasGraph = new AtlasGraph();

		try {
			graph.name = graphJson.name ? graphJson.name : 'undefined_name';
			graph.nodes = ServerUtils.extractNodes(graphJson.nodes);
			graph.edges = ServerUtils.extractEdges(graphJson.edges);
			return graph;
		} catch (e) {
			alert(`This JSON is not an AtlasGraph: ${e}`);
		}
		return new AtlasGraph();
	}

	public static jsonStringToGraph(graphData: string): AtlasGraph {
		try {
			return this.jsonToGraph(JSON.parse(graphData));
		} catch (e) {
			alert(`Something went wrong while loading your JSON: ${e}`);
		}
		return new AtlasGraph();
	}
}
