import FormulaNode from './FormulaNode';
import Node, { Position } from '../Node';
import Import from '../../namespaces/Import';
import FormulaUtils from '../../../utils/algorithms/FormulaUtils';
import Graph from '../../Graph';

class ExpressionNode extends FormulaNode {
	private precision: number;

	constructor(name: string, content: string, precision: number) {
		super(name, content);
		this.precision = precision;
	}

	public getImport(): Import {
		return ExpressionNode.getImport();
	}

	public static getImport(): Import {
		return new Import('system', 'formulas', 'ExpressionNode');
	}

	public static getNewBlock(pos: Position) {
		return new ExpressionNode('', '', 0).setPosition(pos);
	}

	public async evaluate(graph: Graph): Promise<string> {
		const rpn = FormulaUtils.getReversePolishNotation(this, graph);
		const result = await FormulaUtils.evaluateReversePolishNotation(rpn, graph);
		this.setResult(result);
		return result;
	}

	public getProviderNodes(graph: Graph): Node[] {
		const rpn = FormulaUtils.getReversePolishNotation(this, graph).toArray();
		const providerNodes: Node[] = [];
		for (const token of rpn) {
			const node = graph.getNodeByNameOrNull(token);
			if (node instanceof Node) providerNodes.push(node);
		}
		return providerNodes;
	}

	public setContent(content: string) {
		this.content = content;
	}
}

export default ExpressionNode;
