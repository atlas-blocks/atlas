import AtlasGraph, {
	AtlasEdge,
	AtlasNode,
	ExpressionNode,
	TextNode,
	FileNode,
	MatrixFilterNode,
} from './AtlasGraph';

export default class JsonUtils {
	public static jsonToGraph(graphJson: {
		name: string;
		nodes: { type: string; uitype: string }[];
		edges: object[];
	}): AtlasGraph {
		const graph: AtlasGraph = new AtlasGraph();
		try {
			return graph
				.setName(graphJson.name)
				.setNodes(this.extractNodes(graphJson.nodes))
				.setEdges(this.extractEdges(graphJson.edges));
		} catch (e) {
			window.alert(`This JSON is not an AtlasGraph: ${e}`);
			console.log(graphJson);
		}
		return new AtlasGraph();
	}

	public static jsonStringToGraph(graphData: string): AtlasGraph {
		try {
			return this.jsonToGraph(JSON.parse(graphData));
		} catch (e) {
			window.alert(`Something went wrong while loading your JSON: ${e}`);
		}
		return new AtlasGraph();
	}

	private static readonly typeMap = {
		[ExpressionNode.uitype]: () => ExpressionNode.build(),
		[MatrixFilterNode.uitype]: () => MatrixFilterNode.build(),
		[TextNode.uitype]: () => TextNode.build(),
		[FileNode.uitype]: () => FileNode.build(),
		[AtlasNode.uitype]: () => AtlasNode.build(),
	};

	public static extractNodes(nodes: {}[]): AtlasNode[] {
		const updatedNodes: AtlasNode[] = [];
		for (const node of nodes) {
			updatedNodes.push(this.extractNode(node));
		}
		return updatedNodes;
	}

	public static extractNode(node: any): AtlasNode {
		Object.assign(node);
		Object.assign(node, JSON.parse(node.uidata));
		if (this.typeMap[node.uitype] == undefined) {
			console.log(node);
			throw new Error('no such node uitype: ' + node.uitype);
		}
		return Object.assign(this.typeMap[node.uitype](), node);
	}

	public static extractEdges(edges: object[]): AtlasEdge[] {
		const updatedEdges: AtlasEdge[] = [];
		edges.forEach((edge: object) => updatedEdges.push(Object.assign(AtlasEdge.build(), edge)));
		return updatedEdges;
	}

	private static getNodeToJsonString(node: AtlasNode, space?: number): string {
		return JSON.stringify({ ...node, uidata: node.getUiData() }, null, space);
	}

	private static jsonStringifyReplacer(key: string, value: any) {
		if (value instanceof AtlasNode) {
			return JSON.parse(JsonUtils.getNodeToJsonString(value));
		}
		return value;
	}

	public static stringify(object: any, space?: number): string {
		return JSON.stringify(object, this.jsonStringifyReplacer, space);
	}

	public static getJson(object: any): any {
		return JSON.parse(this.stringify(object));
	}
}
