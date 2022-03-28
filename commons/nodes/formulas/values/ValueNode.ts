import { ExpressionNode } from '../ExpressionNode';
import { Unit } from '../units/Unit';

export class ValueNode extends ExpressionNode {
	private value: number;
	private unit: Unit;

	constructor(
		id: string,
		name: string,
		description: string,
		content: string,
		precision: number,
		value: number,
		unit: Unit,
	) {
		super(id, name, description, content, precision);
		this.value = value;
		this.unit = unit;
	}
}
