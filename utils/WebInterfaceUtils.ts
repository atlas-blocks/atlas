import React from 'react';
import Graph from '../commons/Graph';
import Node from '../commons/nodes/Node';
import { Node as Block, Elements } from 'react-flow-renderer';
import ExpressionNode from '../commons/nodes/formulas/ExpressionNode';
import FunctionNode from '../commons/nodes/formulas/functions/FunctionNode';

class WebInterfaceUtils {
	graph: Graph;
	setElements: React.Dispatch<React.SetStateAction<Elements>>;
	setSelectedNode: React.Dispatch<React.SetStateAction<Node | null>>;

	constructor(
		graph: Graph,
		setElements: React.Dispatch<React.SetStateAction<Elements>>,
		setSelectedNode: React.Dispatch<React.SetStateAction<Node | null>>,
	) {
		this.graph = graph;
		this.setElements = setElements;
		this.setSelectedNode = setSelectedNode;
	}

	public static toBlock(node: Node): Block {
		return {
			id: node.getId(),
			type: node.getImport().toString(),
			position: node.getPosition(),
			data: { node: node },
			isHidden: !node.isVisible(),
		};
	}

	public static getElements(graph: Graph): Elements {
		return WebInterfaceUtils.getBlocks(graph).concat(WebInterfaceUtils.getEdges(graph));
	}

	public static getBlocks(graph: Graph): Elements {
		let ans: Elements = [];
		for (const node of graph.getNodes()) {
			ans.push(this.toBlock(node));
		}
		return ans;
	}

	public static getEdges(graph: Graph): Elements {
		let ans: Elements = [];
		for (const node of graph.getNodes()) {
			if (!node.isVisible()) continue;
			for (const provider of node.getProviderNodes(graph)) {
				if (!provider.isVisible()) continue;
				ans.push({
					id: 'edge' + node.getId() + provider.getId(),
					source: provider.getId(),
					target: node.getId(),
					type: 'DefaultEdge',
				});
			}
		}
		return ans;
	}

	public refreshElements() {
		this.setElements((els) => WebInterfaceUtils.getElements(this.graph));
	}

	public async updateExpressionContent(node: ExpressionNode, content: string) {
		await node.updateContent(content, this.graph);
		this.refreshElements();
	}

	public getFunctionSignature(name: string, multiline = false): string {
		const func = this.graph.getNodeByNameOrNull(name);
		if (!(func instanceof FunctionNode)) return '';
		return (
			func.getName() +
			'(' +
			(multiline ? '\n    ' : '') +
			func
				.getArgs()
				.map((arg) => arg.name + ': ' + arg.type)
				.join(',' + (multiline ? '\n    ' : ' ')) +
			(multiline ? '\n' : '') +
			'): ' +
			func.getReturnType()
		);
	}
}

export default WebInterfaceUtils;
