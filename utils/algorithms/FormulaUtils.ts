import Graph from '../../commons/Graph';
import { ArrayQueue, Queue } from '../data_sturctures/Queue';
import { ArrayStack } from '../data_sturctures/Stack';
import ExpressionNode from '../../commons/nodes/formulas/ExpressionNode';
import FunctionNode from '../../commons/nodes/formulas/FunctionNode';
import FormulaNode from '../../commons/nodes/formulas/FormulaNode';

export default class FormulaUtils {
	/**
	 * Implements shunting-yard-algorithm
	 * @param formulaNode
	 * @param graph
	 */
	public static getReversePolishNotation(formulaNode: FormulaNode, graph: Graph): Queue<string> {
		const outputQueue = new ArrayQueue<string>();
		const operationStack = new ArrayStack<string>();
		const tokens: string[] = formulaNode.getContent().split(' ');
		const operationsL1 = ['+', '-'];
		const operationsL2 = ['/', '*'];

		for (const token of tokens) {
			const node = graph.getNodeByNameOrNull(token);
			if (isNaN(Number(token))) {
				outputQueue.enqueue(token);
			} else if (node !== null && node instanceof ExpressionNode) {
				outputQueue.enqueue(token);
			} else if (node instanceof FunctionNode) {
				operationStack.push(token);
			} else if (operationsL1.includes(token) || operationsL2.includes(token)) {
				while (!operationStack.isEmpty() && operationsL2.includes(operationStack.peek())) {
					outputQueue.enqueue(operationStack.pop());
				}
				operationStack.push(token);
			} else if (token === '(') {
				operationStack.push(token);
			} else if (token === ')') {
				while (operationStack.peek() !== '(') {
					outputQueue.enqueue(operationStack.pop());
				}
				operationStack.pop();
			}
		}
		while (!operationStack.isEmpty()) {
			outputQueue.enqueue(operationStack.pop());
		}
		return outputQueue;
	}
}
