import React from 'react';
import { Node as UINode, Edge as UIEdge, NodeChange as UINodeChange } from 'react-flow-renderer';
import DesmosNode from '../graph/nodes/DesmosNode';
import DesmosFlow from '../flows/DesmosFlow';
import AtlasNode from '../graph/nodes/AtlasNode';
import AtlasEdge from '../graph/edges/AtlasEdge';
import AtlasGraph from '../graph/AtlasGraph';
import JsonUtils from './JsonUtils';

import { awu } from './AtlasWindowUtils';

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
			type: node.ui_type,
			position: { x: node.ui_position[0], y: node.ui_position[1] },
			data: { node: node },
			hidden: !node.ui_visibility,
		};
	}

	public static toUiEdge(edge: AtlasEdge): UIEdge {
		return {
			id: 'edge' + edge.provider.getId() + edge.user.getId(),
			source: edge.provider.getId(),
			target: edge.user.getId(),
			type: 'DefaultEdge',
		};
	}

	public static getUiNodes(graph: AtlasGraph): UINode[] {
		const ans: UINode[] = [];
		for (const node of graph.nodes) {
			ans.push(this.toUiNode(node));
		}
		return ans;
	}

	public static getUiEdges(graph: AtlasGraph): UIEdge[] {
		return graph.getEdges().map((edge) => this.toUiEdge(edge));
	}

	public refreshUiElements() {
		this.setUiNodes((els) => WebInterfaceUtils.getUiNodes(this.graph));
		this.setUiEdges((els) => WebInterfaceUtils.getUiEdges(this.graph));
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
				node.setUiPosition(change.position.x, change.position.y);
			}
			if (change.type === 'remove') {
				if (this.selectedNode instanceof DesmosNode) {
					awu.removeById(new DesmosFlow(this.selectedNode).getId());
				}
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
}

// eslint-disable-next-line
// @ts-ignore
export const wiu: WebInterfaceUtils = new WebInterfaceUtils();
