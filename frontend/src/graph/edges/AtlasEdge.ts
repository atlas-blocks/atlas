import AtlasNode from '../nodes/AtlasNode';

export default class AtlasEdge {
	public user: AtlasNode;
	public provider: AtlasNode;

	constructor(user: AtlasNode, provider: AtlasNode) {
		this.user = user;
		this.provider = provider;
	}
}
