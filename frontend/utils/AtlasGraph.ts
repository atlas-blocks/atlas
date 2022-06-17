import React, { SetStateAction, useState } from 'react';
import { Node as UINode } from 'react-flow-renderer/dist/esm/types/nodes';

export default class AtlasGraph {
	public name: string;
	public readonly nodes: AtlasNode[];
	public readonly edges: AtlasEdge[];

	constructor() {
		this.name = '';
		this.nodes = [];
		this.edges = [];
	}

	public replaceWithNew(newGraph: AtlasGraph): void {
		this.setName(newGraph.name).setNodes(newGraph.nodes).setEdges(newGraph.edges);
	}

	public setName(name: string): AtlasGraph {
		this.name = name;
		return this;
	}

	public setNodes(nodes: AtlasNode[]): AtlasGraph {
		this.nodes.splice(0, this.nodes.length);
		this.nodes.push(...nodes);
		return this;
	}

	public setEdges(edges: AtlasEdge[]): AtlasGraph {
		this.edges.splice(0, this.edges.length);
		this.edges.push(...edges);
		return this;
	}

	private isInDefaultNameFormat(name: string) {
		return name[0] === 'b' && !isNaN(Number(name.slice(1)));
	}

	public getDefaultName() {
		const defaultNodesNameNumbers: number[] = this.nodes
			.filter((node) => this.isInDefaultNameFormat(node.name))
			.map((node) => Number(node.name.slice(1)));
		return 'b' + (Math.max(...defaultNodesNameNumbers, 0) + 1);
	}

	public removeById(id: string) {
		const nodeToRemove = this.getById(id);
		this.nodes.splice(this.nodes.indexOf(nodeToRemove), 1);
	}

	getByName(name: string): AtlasNode[] {
		return this.nodes.filter((node) => node.name === name);
	}

	getById(id: string): AtlasNode {
		const nodes = this.nodes.filter((node) => node.getId() === id);
		console.assert(nodes.length == 1);
		return nodes[0];
	}
}

export class AtlasEdge {
	public to: string;
	public from: string;

	constructor(to: string, from: string) {
		this.to = to;
		this.from = from;
	}

	public static build() {
		return new AtlasEdge('', '');
	}
}

export class AtlasNode {
	static type: string = 'AtlasGraph.Node';
	public type: string;
	static uitype: string = AtlasNode.type;

	public uitype: string;
	public name: string;
	public position: [number, number];
	public visibility: boolean;

	constructor(
		type: string,
		name: string,
		uitype: string,
		position: [number, number],
		visibility: boolean,
	) {
		this.type = type;
		this.uitype = uitype;
		this.name = name;
		this.uitype = uitype;
		this.position = position;
		this.visibility = visibility;
	}

	public static build() {
		return new AtlasNode('', '', '', [0, 0], true);
	}

	public setDefaultName(graph: AtlasGraph) {
		this.name = graph.getDefaultName();
		return this;
	}

	public getId() {
		return this.name;
	}

	public getUiData() {
		return JSON.stringify({
			uitype: this.uitype,
			position: this.position,
			visibility: this.visibility,
		});
	}

	public setType(type: string): AtlasNode {
		this.type = type;
		return this;
	}

	public setName(name: string): AtlasNode {
		this.name = name;
		return this;
	}

	public setPosition(x: number, y: number): AtlasNode {
		this.position = [x, y];
		return this;
	}
}

export class ContentNode extends AtlasNode {
	public content: string;

	constructor(node: AtlasNode, content: string) {
		super(node.type, node.name, node.uitype, node.position, node.visibility);
		this.content = content;
	}

	public setContent(content: string): ContentNode {
		this.content = content;
		return this;
	}
}

export class TextNode extends ContentNode {
	static type = 'AtlasGraph.TextNode';
	static uitype = TextNode.type;

	constructor(node: AtlasNode, content: string) {
		super(node, content);
		this.type = TextNode.type;
		this.uitype = TextNode.uitype;
	}

	public static build() {
		return new TextNode(AtlasNode.build(), '');
	}
}

export class FileNode extends AtlasNode {
	static type = 'AtlasGraph.FileNode';
	static uitype = FileNode.type;
	public content: string;
	public filename: string;

	constructor(node: AtlasNode, content: string, filename: string) {
		super(FileNode.type, node.name, FileNode.uitype, node.position, node.visibility);
		this.content = content;
		this.filename = filename;
	}

	public static build() {
		return new FileNode(AtlasNode.build(), '', '');
	}
}

export class ExpressionNode extends ContentNode {
	static type = 'AtlasGraph.ExpressionNode';
	static uitype = ExpressionNode.type;
	public result: string;

	constructor(node: AtlasNode, content: string, result: string) {
		super(node, content);
		this.type = ExpressionNode.type;
		this.uitype = ExpressionNode.uitype;
		this.result = result;
	}

	public static build() {
		return new ExpressionNode(AtlasNode.build(), '', '');
	}

	public static buildWithUitype(uitype: string) {
		switch (uitype) {
			case MatrixFilterNode.uitype:
				return MatrixFilterNode.build();
			case SelectNode.uitype:
				return SelectNode.build();
			default:
				return ExpressionNode.build();
		}
	}

	public setResult(result: string): ExpressionNode {
		this.result = result;
		return this;
	}
}

export class MatrixFilterNode extends ExpressionNode {
	static uitype: string = 'MatrixFilterNode';

	constructor(node: AtlasNode, content: string, result: string) {
		super(node, content, result);
		this.uitype = MatrixFilterNode.uitype;
	}

	public static build(): MatrixFilterNode {
		return new MatrixFilterNode(AtlasNode.build(), '', '');
	}
}

export class SelectNode extends ExpressionNode {
	static uitype: string = 'AtlasGraph.SelectNode';
	public options: any;
	public selectedOption: number;

	// public setSelectedOption?: React.Dispatch<React.SetStateAction<number>>;

	constructor(
		node: AtlasNode,
		content: string,
		result: string,
		options: any,
		selectedOption: number,
		// setSelectedOption?: React.Dispatch<React.SetStateAction<number>>,
	) {
		super(node, content, result);
		this.uitype = SelectNode.uitype;
		this.options = options;
		this.selectedOption = selectedOption;
		// this.setSelectedOption = setSelectedOption;
	}

	public static build(): SelectNode {
		return new SelectNode(AtlasNode.build(), '', '', null, 0);
	}
}
