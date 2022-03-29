import React from 'react';
import Graph from '../commons/Graph';
import Node from '../commons/nodes/Node';
import {
	Node as Block,
	Elements,
} from 'react-flow-renderer';
import SimplifyNode from '../commons/nodes/formulas/SimplifyNode';

class WebInterfaceUtils {

	graph: Graph;
	setBlocks: React.Dispatch<React.SetStateAction<Elements>>;
	haveChanges: boolean;
	setHaveChanges: React.Dispatch<React.SetStateAction<boolean>>;


	constructor(graph: Graph, setBlocks: React.Dispatch<React.SetStateAction<Elements>>, havechanges: boolean, setHaveChanges: React.Dispatch<React.SetStateAction<boolean>>) {
		this.graph = graph;
		this.setBlocks = setBlocks;
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

	public static getBlocks(graph: Graph): Elements {
		let ans: Elements = [];
		for (const node of graph.getNodes()) {
			ans.push(this.toBlock(node));
		}
		return ans;
	}

	public refreshBlocks() {
		this.setBlocks(() => WebInterfaceUtils.getBlocks(this.graph));
	}

	public rerenderBlocks() {
		this.setHaveChanges(!this.haveChanges);
	}

	public static fetchNodeLatex(node: SimplifyNode, callback: ()=> any) {
		return node.fetchLatexAsync(callback).finally();
	}
}

export default WebInterfaceUtils;
