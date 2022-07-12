import AtlasNode from '../graph/nodes/AtlasNode';
import ExpressionNode from '../graph/nodes/ExpressionNode';
import FileNode from '../graph/nodes/FileNode';
import TextNode from '../graph/nodes/TextNode';
import SelectionNode from '../graph/nodes/SelectionNode';
import MatrixFilterNode from '../graph/nodes/MatrixFilterNode';
import ObjectNode from '../graph/nodes/ObjectNode';
import AtlasEdge from '../graph/edges/AtlasEdge';
import AtlasGraph from '../graph/AtlasGraph';

export default class JsonUtils {
	public static jsonToGraph(graphJson: {
		name: string;
		nodes: { type: string; ui_type: string }[];
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
		[ExpressionNode.ui_type]: ExpressionNode.build,
		[MatrixFilterNode.ui_type]: MatrixFilterNode.build,
		[SelectionNode.ui_type]: SelectionNode.build,
		[TextNode.ui_type]: TextNode.build,
		[FileNode.ui_type]: FileNode.build,
		[ObjectNode.ui_type]: ObjectNode.build,
		[AtlasNode.ui_type]: AtlasNode.build,
	};

	public static extractNodes(nodes: Record<string, unknown>[]): AtlasNode[] {
		const updatedNodes: AtlasNode[] = [];
		for (const node of nodes) {
			updatedNodes.push(this.extractNode(node));
		}
		return updatedNodes;
	}

	public static extractNode(node: any): AtlasNode {
		if (this.typeMap[node.ui_type] == undefined) {
			console.log(node);
			throw new Error('no such node ui_type: ' + node.ui_type);
		}
		return Object.assign(this.typeMap[node.ui_type](), node);
	}

	public static extractEdges(edges: object[]): AtlasEdge[] {
		const updatedEdges: AtlasEdge[] = [];
		edges.forEach((edge: object) => updatedEdges.push(Object.assign(AtlasEdge.build(), edge)));
		return updatedEdges;
	}

	public static stringify(object: any, space?: number): string {
		return JSON.stringify(object, undefined, space);
	}

	public static getJson(object: any): any {
		return JSON.parse(this.stringify(object));
	}
}
