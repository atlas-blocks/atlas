import ExpressionNode from '../ExpressionNode';
import Unit from '../units/Unit';

class ValueNode extends ExpressionNode {
	private value: number;
	private unit: Unit;

	constructor(name: string, description: string, content: string, precision: number, value: number, unit: Unit) {
		super(name, description, content, precision);
		this.value = value;
		this.unit = unit;
	}
}

export default ValueNode;
