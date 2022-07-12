import ExpressionNode from './ExpressionNode';

export default class ObjectNode extends ExpressionNode {
	static ui_type = 'AtlasGraph.ObjectNode';
	public ui_objProperties: [string, string][];

	constructor() {
		super();
		this.ui_type = ObjectNode.ui_type;
		this.setContent('');
		this.ui_objProperties = [['', '']];
	}

	private updateContent() {
		let newContent = 'Dict(';
		this.ui_objProperties.forEach((prop) => (newContent += `"${prop[0]}" => ${prop[1]},`));
		newContent = newContent.slice(0, newContent.length - 1) + ')';
		this.content = newContent;
	}

	public setObjProperties(properties: [string, string][]): ObjectNode {
		this.ui_objProperties = properties;
		this.updateContent();
		return this;
	}

	public static build(): ObjectNode {
		return new ObjectNode();
	}
}
