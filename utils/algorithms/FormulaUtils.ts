import Graph from '../../commons/Graph';
import { ArrayQueue, Queue } from '../data_sturctures/Queue';
import { ArrayStack } from '../data_sturctures/Stack';
import ExpressionNode from '../../commons/nodes/formulas/ExpressionNode';
import FunctionNode from '../../commons/nodes/formulas/functions/FunctionNode';
import FormulaNode from '../../commons/nodes/formulas/FormulaNode';

export default class FormulaUtils {
	static readonly TypesFunctions = {
		map: {
			name: '__map__',
			keyPrefix: '__map_key__',
		},
	};

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
			} else {
				outputQueue.enqueue(token);
			}
		}
		while (!operationStack.isEmpty()) {
			outputQueue.enqueue(operationStack.pop());
		}
		return outputQueue;
	}

	public static splitIntoTokens(content: string): string[] {
		const operations = ['+', '-', '/', '*'];
		let ans: string[] = [];
		let curr = '';
		for (let i = 0; i < content.length; ) {
			curr = '';
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
				ans = ans.concat(this.splitMapIntoTokens(curr));
				curr = '';
			} else if (content[i] === '[') {
				for (; i < content.length && content[i] !== ']'; ++i) curr += content[i];
				curr += content[i];
				++i;
			} else if (operations.includes(content[i])) {
				curr += content[i];
				++i;
			} else if (content[i] === '(' || content[i] === ')') {
				curr += content[i];
				++i;
			} else {
				++i;
			}
			if (curr !== '') ans.push(curr);
		}
		return ans;
	}

	public static splitMapIntoTokens(map: string): string[] {
		const removedBrackets = map.slice(2, -1);
		const parsedToKeyValue = removedBrackets.split(',"');
		let ans: string[] = [this.TypesFunctions.map.name, '('];
		for (const keyValue of parsedToKeyValue) {
			const [key, value] = keyValue.split('":');
			ans = ans.concat(this.splitIntoTokens(value));
			ans.push(this.TypesFunctions.map.keyPrefix + key);
		}

		// for (let i = 0; i < removedBrackets.length; ++i) {
		// 	if (removedBrackets[i] !== '"') throw new Error("error while parsing map: " + map)
		// 	++i;
		// 	const nextQuote = removedBrackets.indexOf('"', i);
		// 	if (nextQuote - i <= 0)  throw new Error("error while parsing map: " + map);
		// 	const key = removedBrackets.slice(i, nextQuote)
		// 	// TODO check that key is valid -- only letters and digits
		// 	++i;
		// 	if (removedBrackets[i] != ':')  throw new Error("error while parsing map: " + map);
		// 	++i;
		// }
		ans.push(')');
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

		const argumentsStack = new ArrayStack<string>();
		for (const token of rpn.toArray()) {
			const node = graph.getNodeByNameOrNull(token);
			if (!isNaN(Number(token))) {
				argumentsStack.push(token);
			} else if (node instanceof ExpressionNode) {
				argumentsStack.push(node.getResult());
			} else if (node instanceof FunctionNode) {
				const args: string[] = [];
				if (token === this.TypesFunctions.map.name) {
					while (
						argumentsStack.size() !== 0 &&
						argumentsStack.peek().startsWith(this.TypesFunctions.map.keyPrefix)
					) {
						const key = argumentsStack
							.pop()
							.slice(this.TypesFunctions.map.keyPrefix.length);
						const value = argumentsStack.pop().slice(1, -1);
						args.push(value);
						args.push(key);
					}
				} else {
					for (let i = 0; i < node.getArgs().length; ++i) args.push(argumentsStack.pop());
				}
				argumentsStack.push(await node.call(args));
			} else if (operations.includes(token)) {
				const arg2 = argumentsStack.pop();
				const arg1 = argumentsStack.pop();
				argumentsStack.push(eval(arg1 + token + arg2));
			} else {
				argumentsStack.push(token);
			}
		}
		console.assert(argumentsStack.size() === 1, 'there should be only one result left');
		return argumentsStack.pop();
	}
}
