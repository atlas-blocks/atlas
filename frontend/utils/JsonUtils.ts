import AtlasGraph, { AtlasEdge, AtlasNode, ExpressionNode, TextNode, FileNode } from './AtlasGraph';

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
		[ExpressionNode.type]: (uitype: string) => ExpressionNode.buildWithUitype(uitype),
		[TextNode.type]: (uitype: string) => TextNode.build(),
		[FileNode.type]: (uitype: string) => FileNode.build(),
		[AtlasNode.type]: (uitype: string) => AtlasNode.build(),
	};

	public static extractNodes(nodes: { type: string; uitype: string }[]): AtlasNode[] {
		const updatedNodes: AtlasNode[] = [];
		for (const node of nodes) {
			if (this.typeMap[node.type] == undefined) {
				throw new Error('no such node type: ' + node.type);
			}
			const newNode: AtlasNode = this.typeMap[node.type](node.uitype);
			updatedNodes.push(Object.assign(newNode, node));
		}
		return updatedNodes;
	}

	public static extractEdges(edges: object[]): AtlasEdge[] {
		const updatedEdges: AtlasEdge[] = [];
		edges.forEach((edge: object) => updatedEdges.push(Object.assign(AtlasEdge.build(), edge)));
		return updatedEdges;
	}
}
