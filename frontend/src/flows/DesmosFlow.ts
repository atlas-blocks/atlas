import Flow from './Flow';
import DesmosNode from '../graph/nodes/DesmosNode';

export default class DesmosFlow extends Flow {
	node: DesmosNode;

	constructor(node: DesmosNode) {
		super();
		this.node = node;
	}

	public getId() {
		return this.node.getId();
	}

	public getName() {
		return this.node.name;
	}
}
