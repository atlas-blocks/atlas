import WebInterfaceUtils from './WebInterfaceUtils';
import JuliaExecuter from '../kernels/JuliaExecuter';
import AtlasGraph from '../graph/AtlasGraph';

export default class AtlasModule {
	graph: AtlasGraph;
	executer: JuliaExecuter;
	wiu: WebInterfaceUtils;

	constructor(graph: AtlasGraph, executer: JuliaExecuter, wiu: WebInterfaceUtils) {
		this.graph = graph;
		this.wiu = wiu;
		this.executer = executer;
	}

	public async updateGraph() {
		this.graph.nodes.forEach(async (node) => {
			await this.executer.executeAtlasNode(node);
			this.wiu.refreshUiElements();
		});
	}

	public replaceGraphWithNew(newGraph: AtlasGraph): void {
		this.graph.replaceWithNew(newGraph);
		this.wiu.setSelectedNode(null);
		this.wiu.refreshUiElements();
	}
}

// eslint-disable-next-line
// @ts-ignore
export const atlasModule: AtlasModule = new AtlasModule();
