import Node from '../nodes/Node';

interface Namespace {
	getPackage(): string;

	getNodeByNameOrNull(name: string): Node | null;
	getAllNodes(): Node[];
}

export default Namespace;
