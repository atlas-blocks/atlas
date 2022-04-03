import Import from '../namespaces/Import';
import Graph from '../Graph';

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

	protected constructor(name: string) {
		this.id = Node.cnt.toString();
		++Node.cnt;
		this.name = name != '' ? name : 'b' + this.id;
		this.description = '';
		this.position = { x: 0, y: 0 };
	}

	public getImport() {
		return Node.getImport();
	}

	public static getImport() {
		return new Import('system', '', 'Node');
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

	public getUsersNodes(graph: Graph): Node[] {
		return [];
	}
}

export default Node;
