import AtlasGraph from './AtlasGraph';
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
		JSON.parse(jsonStringWithGraphs).map((item: any) =>
			recentGraphs.push(JsonUtils.jsonToGraph(item)),
		);

		return recentGraphs;
	}

	public static getRecentGraphsFromLocalStorageExceptWithName(name: string) {
		return this.getRecentGraphsFromLocalStorage().filter(
			(graph: AtlasGraph) => graph.name !== name,
		);
	}
}
