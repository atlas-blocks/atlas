import AtlasGraph from '../AtlasGraph';

export default class AtlasNode {
	static ui_type = 'AtlasGraph.Node';

	public name = '';
	public type: string = AtlasNode.ui_type;
	public ui_type: string = AtlasNode.ui_type;
	public ui_position: [number, number] = [0, 0];
	public ui_visibility = true;

	public static build(): AtlasNode {
		return new AtlasNode();
	}

	public getId(): string {
		return this.name;
	}

	public setName(name: string): AtlasNode {
		this.name = name;
		return this;
	}

	public setDefaultName(graph: AtlasGraph): AtlasNode {
		this.name = graph.getDefaultName();
		return this;
	}

	public setUiType(visibility: boolean): AtlasNode {
		this.ui_visibility = visibility;
		return this;
	}

	public setUiPosition(x: number, y: number): AtlasNode {
		this.ui_position = [x, y];
		return this;
	}

	public setUiVisibility(visibility: boolean): AtlasNode {
		this.ui_visibility = visibility;
		return this;
	}
}
