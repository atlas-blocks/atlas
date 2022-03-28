import Graph from '../commons/Graph';
import Node from '../commons/nodes/Node';
import ReactFlow, {
	addEdge,
	removeElements,
	Controls,
	Edge,
	Node as Block,
	Elements,
	Connection,
	ReactFlowProvider,
	MiniMap,
	isNode,
} from 'react-flow-renderer';

abstract class WebInterfaceUtils {
	public static toBlock(node: Node): Block {
		return {
			id: node.getId(),
			type: node.constructor.name,
			position: node.getPosition(),
			data: { node: node },
		};
	}

	public static toBlocks(graph: Graph): Elements {
		let ans: Elements = [];
		for (const node of graph.getNodes()) {
			ans.push(this.toBlock(node));
		}
		return ans;
	}
}

export default WebInterfaceUtils;
