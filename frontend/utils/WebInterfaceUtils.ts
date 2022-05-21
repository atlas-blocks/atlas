import React from 'react';
import { Node as UINode, Edge as UIEdge, NodeChange as UINodeChange } from 'react-flow-renderer';
import AtlasGraph, { AtlasNode } from '../utils/AtlasGraph';
import ServerUtils from './ServerUtils';

export default class WebInterfaceUtils {
	graph: AtlasGraph;
	setUINodes: React.Dispatch<React.SetStateAction<UINode[]>>;
	setUIEdges: React.Dispatch<React.SetStateAction<UIEdge[]>>;
	setSelectedNode: React.Dispatch<React.SetStateAction<AtlasNode | null>>;

	constructor(
		graph: AtlasGraph,
		setUINodes: React.Dispatch<React.SetStateAction<UINode[]>>,
		setUIEdges: React.Dispatch<React.SetStateAction<UIEdge[]>>,
		setSelectedNode: React.Dispatch<React.SetStateAction<AtlasNode | null>>,
	) {
		this.graph = graph;
		this.setUINodes = setUINodes;
		this.setUIEdges = setUIEdges;
		this.setSelectedNode = setSelectedNode;
	}

	public static toUiNode(node: AtlasNode): UINode {
		return {
			id: node.getId(),
			type: node.type,
			position: { x: node.position[0], y: node.position[1] },
			data: { node: node },
			hidden: !node.visibility,
		};
	}

	public static toUiEdge(from: AtlasNode, to: AtlasNode): UIEdge {
		return {
			id: 'edge' + from.getId() + to.getId(),
			source: from.getId(),
			target: to.getId(),
			type: 'DefaultEdge',
		};
	}

	public static getUiNodes(graph: AtlasGraph): UINode[] {
		let ans: UINode[] = [];
		for (const node of graph.nodes) {
			ans.push(this.toUiNode(node));
		}
		return ans;
	}

	public static getUiEdges(graph: AtlasGraph): UIEdge[] {
		let ans: UIEdge[] = [];

		for (const edge of graph.edges) {
			const froms = graph.getByName(edge.from);
			const tos = graph.getByName(edge.to);

			for (const from of froms) {
				for (const to of tos) {
					ans.push(this.toUiEdge(from, to));
				}
			}
		}
		return ans;
	}

	public refreshUiElements() {
		this.setUINodes((els) => WebInterfaceUtils.getUiNodes(this.graph));
		this.setUIEdges((els) => WebInterfaceUtils.getUiEdges(this.graph));
	}

	public async updateGraph() {
		await ServerUtils.updateGraph(this.graph);
		this.refreshUiElements();
	}

	public updateNodes(changes: UINodeChange[]) {
		for (const change of changes) {
			if (change.type === 'position') {
				if (change.position === undefined) return;
				const node = this.graph.getById(change.id);
				node.setPosition(change.position.x, change.position.y);
			}
		}
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
