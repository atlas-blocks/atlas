import React from 'react';
import { Node as Block, Elements } from 'react-flow-renderer';
import AtlasGraph, { AtlasNode } from '../utils/AtlasGraph';
import ServerUtils from './ServerUtils';

export default class WebInterfaceUtils {
	graph: AtlasGraph;
	setElements: React.Dispatch<React.SetStateAction<Elements>>;
	setSelectedNode: React.Dispatch<React.SetStateAction<AtlasNode | null>>;

	constructor(
		graph: AtlasGraph,
		setElements: React.Dispatch<React.SetStateAction<Elements>>,
		setSelectedNode: React.Dispatch<React.SetStateAction<AtlasNode | null>>,
	) {
		this.graph = graph;
		this.setElements = setElements;
		this.setSelectedNode = setSelectedNode;
	}

	public static toBlock(node: AtlasNode): Block {
		return {
			id: node.getId(),
			type: node.type,
			position: { x: node.position[0], y: node.position[1] },
			data: { node: node },
			isHidden: !node.visibility,
		};
	}

	public static getElements(graph: AtlasGraph): Elements {
		return WebInterfaceUtils.getBlocks(graph).concat(WebInterfaceUtils.getEdges(graph));
	}

	public static getBlocks(graph: AtlasGraph): Elements {
		let ans: Elements = [];
		for (const node of graph.nodes) {
			ans.push(this.toBlock(node));
		}
		return ans;
	}

	public static getEdges(graph: AtlasGraph): Elements {
		let ans: Elements = [];

		for (const edge of graph.edges) {
			const froms = graph.nodes.filter((node) => node.name === edge.from);
			const tos = graph.nodes.filter((node) => node.name === edge.to);

			for (const from of froms) {
				for (const to of tos) {
					ans.push({
						id: 'edge' + from.getId() + to.getId(),
						source: from.getId(),
						target: to.getId(),
						type: 'DefaultEdge',
					});
				}
			}
		}
		return ans;
	}

	public refreshElements() {
		this.setElements((els) => WebInterfaceUtils.getElements(this.graph));
	}

	public async updateGraph() {
		// console.log(this.graph)
		await ServerUtils.updateGraph(this.graph);
		this.refreshElements();
	}

	public getFunctionSignature(name: string, multiline = false): string {
		// const func = this.graph.getNodeByNameOrNull(name);
		// if (!(func instanceof FunctionNode)) return '';
		// return (
		// 	func.getName() +
		// 	'(' +
		// 	(multiline ? '\n    ' : '') +
		// 	func
		// 		.getArgs()
		// 		.map((arg) => arg.name + ': ' + arg.type)
		// 		.join(',' + (multiline ? '\n    ' : ' ')) +
		// 	(multiline ? '\n' : '') +
		// 	'): ' +
		// 	func.getReturnType()
		// );
		return 'signature';
	}
}
