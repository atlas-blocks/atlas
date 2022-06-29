import React from 'react';
import { Node as UINode, Edge as UIEdge, NodeChange as UINodeChange } from 'react-flow-renderer';
import AtlasGraph, { AtlasNode } from '../utils/AtlasGraph';
import ServerUtils from './ServerUtils';
import JsonUtils from './JsonUtils';

export default class WebInterfaceUtils {
	graph: AtlasGraph;
	uiNodes: UINode[];
	uiEdges: UIEdge[];
	setUiNodes: React.Dispatch<React.SetStateAction<UINode[]>>;
	setUiEdges: React.Dispatch<React.SetStateAction<UIEdge[]>>;
	selectedNode: AtlasNode | null;
	setSelectedNode: React.Dispatch<React.SetStateAction<AtlasNode | null>>;
	druggedNode: AtlasNode | null;
	setDruggedNode: React.Dispatch<React.SetStateAction<AtlasNode | null>>;

	constructor(
		graph: AtlasGraph,
		uiNodes: UINode[],
		uiEdges: UIEdge[],
		setUiNodes: React.Dispatch<React.SetStateAction<UINode[]>>,
		setUiEdges: React.Dispatch<React.SetStateAction<UIEdge[]>>,
		selectedNode: AtlasNode | null,
		setSelectedNode: React.Dispatch<React.SetStateAction<AtlasNode | null>>,
		druggedNode: AtlasNode | null,
		setDruggedNode: React.Dispatch<React.SetStateAction<AtlasNode | null>>,
	) {
		this.graph = graph;
		this.uiNodes = uiNodes;
		this.uiEdges = uiEdges;
		this.setUiNodes = setUiNodes;
		this.setUiEdges = setUiEdges;
		this.selectedNode = selectedNode;
		this.setSelectedNode = setSelectedNode;
		this.druggedNode = druggedNode;
		this.setDruggedNode = setDruggedNode;
	}

	public static toUiNode(node: AtlasNode): UINode {
		return {
			id: node.getId(),
			type: node.uitype,
			position: { x: node.position[0], y: node.position[1] },
			data: { node: node },
			hidden: !node.visibility,
			parentNode: node.parentGroup,
			extent: 'parent',
			expandParent: true,
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
		this.setUiNodes((els) => WebInterfaceUtils.getUiNodes(this.graph));
		this.setUiEdges((els) => WebInterfaceUtils.getUiEdges(this.graph));
	}

	public async updateGraph() {
		const updatedGraph = await ServerUtils.getUpdatedGraph(this.graph);
		if (updatedGraph !== null) this.replaceGraphWithNew(updatedGraph);
		this.refreshUiElements();
	}

	public updateNodes(changes: UINodeChange[]) {
		for (const change of changes) {
			if (change.type === 'position') {
				if (change.position === undefined) return;
				const node = this.graph.getById(change.id);
				console.assert(
					node !== undefined,
					`Node with id ${change.id} not found in graph ${JsonUtils.stringify(
						this.graph,
						2,
					)}`,
				);
				node.setPosition(change.position.x, change.position.y);
			}
			if (change.type === 'remove') {
				this.graph.removeById(change.id);
				this.setSelectedNode(null);
			}
		}
	}

	public getUiNodeWidth(node: AtlasNode): number {
		return 100;
	}

	public getUiNodeHeight(node: AtlasNode): number {
		return 100;
	}

	public replaceGraphWithNew(newGraph: AtlasGraph): void {
		this.graph.replaceWithNew(newGraph);
		this.setSelectedNode(null);
		this.refreshUiElements();
	}
}

// @ts-ignore
export const wiu: WebInterfaceUtils = new WebInterfaceUtils();
