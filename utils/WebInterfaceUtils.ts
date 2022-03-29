import React from 'react';
import Graph from '../commons/Graph';
import Node from '../commons/nodes/Node';
import { Node as Block, Edge as BlockEdge, Elements } from 'react-flow-renderer';
import SimplifyNode from '../commons/nodes/formulas/SimplifyNode';

class WebInterfaceUtils {
	graph: Graph;
	setElements: React.Dispatch<React.SetStateAction<Elements>>;
	haveChanges: boolean;
	setHaveChanges: React.Dispatch<React.SetStateAction<boolean>>;

	constructor(
		graph: Graph,
		setElements: React.Dispatch<React.SetStateAction<Elements>>,
		havechanges: boolean,
		setHaveChanges: React.Dispatch<React.SetStateAction<boolean>>,
	) {
		this.graph = graph;
		this.setElements = setElements;
		this.haveChanges = havechanges;
		this.setHaveChanges = setHaveChanges;
	}

	public static toBlock(node: Node): Block {
		return {
			id: node.getId(),
			type: node.constructor.name,
			position: node.getPosition(),
			data: { node: node },
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
			if (node instanceof SimplifyNode) {
				for (const ref of node.getOutRefNodes()) {
					ans.push({
						id: 'edge' + node.getId() + ref.getId(),
						source: node.getId(),
						target: ref.getId(),
					});
				}
			}
		}
		return ans;
	}

	public refreshElements() {
		this.setElements(() => WebInterfaceUtils.getElements(this.graph));
	}

	public rerenderElements() {
		this.setHaveChanges(!this.haveChanges);
	}

	public static fetchNodeLatex(node: SimplifyNode, callback: () => any) {
		return node.fetchLatexAsync(callback).finally();
	}
}

export default WebInterfaceUtils;
