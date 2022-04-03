import Node from './nodes/Node';
import FormulaNode from './nodes/formulas/FormulaNode';
import { ArrayStack } from '../utils/data_sturctures/Stack';
import { ArrayQueue, Queue } from '../utils/data_sturctures/Queue';
import ExpressionNode from './nodes/formulas/ExpressionNode';
import FunctionNode from './nodes/formulas/functions/FunctionNode';

class Graph {
	private readonly nodes: Node[];

	constructor() {
		this.nodes = [];
	}

	public getNodes() {
		return this.nodes;
	}

	public addNode(node: Node) {
		this.nodes.push(node);
	}

	public getNodeByIdOrNull(id: string): Node | null {
		const filtered = this.nodes.filter((node) => node.getId() === id);
		console.assert(filtered.length < 2);
		if (filtered.length == 1) return filtered[0];
		return null;
	}

	public getNodeByNameOrNull(name: string): Node | null {
		const filtered = this.nodes.filter((node) => node.getName() === name);
		console.assert(filtered.length < 2);
		if (filtered.length == 1) return filtered[0];
		return null;
	}

	public getNodesByName(name: string): Node[] {
		return this.nodes.filter((node) => node.getName() === name);
	}

	public getNodesByNameAndClassType<T extends Node>(name: string, classType: Function): T[] {
		return this.getNodesByName(name).filter((node) => node instanceof classType) as T[];
	}
}

export default Graph;
