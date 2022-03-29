import NodeTypeNames from './NodeTypeNames';

export type Position = {
	x: number;
	y: number;
};

abstract class Node {
	private static cnt = 0;
	private readonly id: string;
	private name: string;
	private description: string;
	private position: Position;

	protected constructor(name: string, description: string) {
		this.id = Node.cnt.toString();
		++Node.cnt;
		this.name = name != '' ? name : '#' + this.id;
		this.description = description;
		this.position = { x: 0, y: 0 };
	}

	public getType() {
		return NodeTypeNames['Node'];
	}

	public getId() {
		return this.id;
	}

	public getName() {
		return this.name;
	}

	public getDescription() {
		return this.description;
	}

	public getPosition() {
		return this.position;
	}

	public setPosition(pos: Position) {
		this.position = pos;
		return this;
	}
}

export default Node;
