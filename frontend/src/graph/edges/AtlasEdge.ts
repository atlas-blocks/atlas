export default class AtlasEdge {
	public to: string;
	public from: string;

	constructor(to: string, from: string) {
		this.to = to;
		this.from = from;
	}

	public static build() {
		return new AtlasEdge('', '');
	}
}
