abstract class Node {
	readonly id: string;
	private name: string;
	private description: string;

	protected constructor(id: string, name: string, description: string) {
		this.id = id;
		this.name = name;
		this.description = description;
	}
}

export default Node;
