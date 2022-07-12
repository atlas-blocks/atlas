import ExpressionNode from './ExpressionNode';

export default class MatrixFilterNode extends ExpressionNode {
	static ui_type = 'AtlasGraph.MatrixFilterNode';

	constructor() {
		super();
		this.ui_type = MatrixFilterNode.ui_type;
	}

	public static build(): MatrixFilterNode {
		return new MatrixFilterNode();
	}
}
