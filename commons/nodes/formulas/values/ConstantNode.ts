import ValueNode from './ValueNode';
import Unit from '../units/Unit';

class ConstantNode extends ValueNode {
	constructor(
		name: string,
		description: string,
		content: string,
		precision: number,
		value: number,
		unit: Unit,
	) {
		super(name, description, content, precision, value, unit);
	}
}

export default ConstantNode;
