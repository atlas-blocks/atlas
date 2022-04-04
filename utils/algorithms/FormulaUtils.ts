import Graph from '../../commons/Graph';
import { ArrayQueue, Queue } from '../data_sturctures/Queue';
import { ArrayStack } from '../data_sturctures/Stack';
import ExpressionNode from '../../commons/nodes/formulas/ExpressionNode';
import FunctionNode from '../../commons/nodes/formulas/functions/FunctionNode';
import FormulaNode from '../../commons/nodes/formulas/FormulaNode';
import InvalidTokenError from '../errors/InvalidTokenError';

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
			} else if (token === ',') {
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
				throw new InvalidTokenError('cant recognise token: ' + token);
			}
		}
		while (!operationStack.isEmpty()) {
			outputQueue.enqueue(operationStack.pop());
		}
		return outputQueue;
	}

	public static splitIntoTokens(content: string): string[] {
		const operations = ['+', '-', '/', '*'];
		const ans: string[] = [];
		let curr = '';
		for (let i = 0; i < content.length; ) {
			if (this.isLetter(content[i])) {
				for (
					;
					i < content.length && (this.isLetter(content[i]) || this.isDigit(content[i]));
					++i
				) {
					curr += content[i];
				}
				if (i < content.length && content[i] === '[') {
					ans.push('getMapField');
					ans.push('(');
					ans.push(curr);
					curr = '';
					for (; i < content.length && content[i] !== ']'; ++i) {
						curr += content[i];
					}
					ans.push(curr + ']');
					curr = '';
					ans.push(')');
					++i;
				}
			} else if (this.isDigit(content[i])) {
				for (; i < content.length && this.isDigit(content[i]); ++i) {
					curr += content[i];
				}
			} else if (content[i] === '"') {
				curr += content[i];
				++i;
				for (; i < content.length && content[i] !== '"'; ++i) curr += content[i];
				curr += content[i];
				++i;
			} else if (content[i] === '{') {
				for (; i < content.length && content[i] !== '}'; ++i) curr += content[i];
				curr += content[i];
				++i;
			} else if (content[i] === '[') {
				for (; i < content.length && content[i] !== ']'; ++i) curr += content[i];
				curr += content[i];
				++i;
			} else if (operations.includes(content[i])) {
				curr = content[i];
				++i;
			} else {
				++i;
			}
			if (curr !== '') ans.push(curr);
			curr = '';
		}
		console.log(content, ans);
		return ans;
	}

	public static isLetter(str: string) {
		return str.length === 1 && str.match(/[a-zA-Z]/i);
	}

	public static isDigit(str: string) {
		return str.length === 1 && str.match(/^\d+$/);
	}

	public static async evaluateReversePolishNotation(
		rpn: Queue<string>,
		graph: Graph,
	): Promise<string> {
		const operations = ['+', '-', '/', '*'];

		const argumentsQueue = new ArrayQueue<string>();
		for (const token of rpn.toArray()) {
			const node = graph.getNodeByNameOrNull(token);
			if (!isNaN(Number(token))) {
				argumentsQueue.enqueue(token);
			} else if (node instanceof ExpressionNode) {
				argumentsQueue.enqueue(node.getResult());
			} else if (node instanceof FunctionNode) {
				const args: string[] = [];
				for (let i = 0; i < node.getArgs().length; ++i) args.push(argumentsQueue.dequeue());
				argumentsQueue.enqueue(await node.call(args));
			} else if (operations.includes(token)) {
				argumentsQueue.enqueue(
					eval(argumentsQueue.dequeue() + token + argumentsQueue.dequeue()),
				);
			} else if (token.startsWith('"') && token.endsWith('"')) {
				argumentsQueue.enqueue(token);
			} else {
				throw new InvalidTokenError('cant recognise token: ' + token);
			}
		}
		console.assert(argumentsQueue.size() === 1, 'there should be only one result left');
		return argumentsQueue.dequeue();
	}
}
