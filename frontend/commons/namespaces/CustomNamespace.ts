import Node from '../nodes/Node';
import GraphNamespace from './GraphNamespace';
import Graph from '../Graph';

export default class CustomNamespace extends GraphNamespace {
	constructor(pkg: string, nodes: Node[]) {
		super(pkg, new Graph());
		this.getGraph().addNodes(nodes);
	}
}
