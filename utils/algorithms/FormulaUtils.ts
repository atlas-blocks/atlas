import Graph from '../../commons/Graph';
import { ArrayQueue, Queue } from '../data_sturctures/Queue';
import { ArrayStack } from '../data_sturctures/Stack';
import ExpressionNode from '../../commons/nodes/formulas/ExpressionNode';
import FunctionNode from '../../commons/nodes/formulas/functions/FunctionNode';
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
		const tokens: string[] = this.splitIntoTokens(formulaNode.getContent());
		const operationsL1 = ['+', '-'];
		const operationsL2 = ['/', '*'];

		for (const token of tokens) {
			const node = graph.getNodeByNameOrNull(token);
			if (!isNaN(Number(token))) {
				outputQueue.enqueue(token);
			} else if (node instanceof ExpressionNode) {
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
			} else if (token.startsWith('"') && token.endsWith('"')) {
				outputQueue.enqueue(token);
			} else {
				console.assert(false, 'cant recognise token: ' + token);
			}
		}
		while (!operationStack.isEmpty()) {
			outputQueue.enqueue(operationStack.pop());
		}
		return outputQueue;
	}

	public static splitIntoTokens(content: string): string[] {
		return content.split(' ');
	}

	public static async evaluateReversePolishNotation(
		rpn: Queue<string>,
		graph: Graph,
	): Promise<string> {
		const operations = ['+', '-', '/', '*'];

		const argumentsStack = new ArrayStack<string>();
		for (const token of rpn.toArray()) {
			const node = graph.getNodeByNameOrNull(token);
			if (!isNaN(Number(token))) {
				argumentsStack.push(token);
			} else if (node instanceof ExpressionNode) {
				const subResult = await node.evaluate(graph);
				argumentsStack.push(subResult);
			} else if (node instanceof FunctionNode) {
				const args: string[] = [];
				for (let i = 0; i < node.getArgs().length; ++i) args.push(argumentsStack.pop());
				const subResult = await node.call(args);
				argumentsStack.push(subResult);
			} else if (operations.includes(token)) {
				argumentsStack.push(eval(argumentsStack.pop() + token + argumentsStack.pop()));
			} else if (token.startsWith('"') && token.endsWith('"')) {
				argumentsStack.push(token);
			} else {
				console.assert(false, 'cant recognise token: ' + token);
			}
		}
		console.assert(argumentsStack.size() === 1, 'there should be only one result left');
		return argumentsStack.pop();
	}
}
