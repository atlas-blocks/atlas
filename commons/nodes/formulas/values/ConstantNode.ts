import { ValueNode } from './ValueNode';
import { Unit } from '../units/Unit';

export class ConstantNode extends ValueNode {
	constructor(
		id: string,
		name: string,
		description: string,
		content: string,
		precision: number,
		value: number,
		unit: Unit,
	) {
		super(id, name, description, content, precision, value, unit);
	}
}
