import AtlasGraph from '../graph/AtlasGraph';
import JsonUtils from './JsonUtils';

export default class StorageUtils {
	private static readonly recentGraphStorageName = 'AtlasStorage';

	public static saveGraphToLocalStorage(saveGraph: AtlasGraph) {
		const recentGraphs: AtlasGraph[] = this.getRecentGraphsFromLocalStorageExceptWithName(
			saveGraph.name,
		);
		recentGraphs.push(saveGraph);
		localStorage.setItem(this.recentGraphStorageName, JsonUtils.stringify(recentGraphs));
	}

	public static removeGraphFromStorage = (graphName: string) => {
		const recentGraphs: AtlasGraph[] =
			this.getRecentGraphsFromLocalStorageExceptWithName(graphName);
		localStorage.setItem(this.recentGraphStorageName, JsonUtils.stringify(recentGraphs));
	};

	public static getRecentGraphsFromLocalStorage(): AtlasGraph[] {
		const jsonStringWithGraphs: string | null = localStorage.getItem(
			this.recentGraphStorageName,
		);
		if (jsonStringWithGraphs === null) return [];

		const recentGraphs: AtlasGraph[] = [];
		JSON.parse(jsonStringWithGraphs).map(
			(item: { name: string; nodes: any[]; edges: any[] }) => {
				const graph = JsonUtils.jsonToGraph(item);
				if (graph !== null) recentGraphs.push(graph);
			},
		);

		return recentGraphs;
	}

	public static getRecentGraphsFromLocalStorageExceptWithName(name: string): AtlasGraph[] {
		return this.getRecentGraphsFromLocalStorage().filter(
			(graph: AtlasGraph) => graph.name !== name,
		);
	}
}
