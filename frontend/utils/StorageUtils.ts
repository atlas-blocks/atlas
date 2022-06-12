import AtlasGraph from './AtlasGraph';
import JsonUtils from './JsonUtils';

export default class StorageUtils {
	private static readonly recentGraphStorageName = 'AtlasStorage';

	public static saveGraphToLocalStorage(saveGraph: AtlasGraph) {
		const strFromStorage: string | null = localStorage.getItem(this.recentGraphStorageName);
		let atlasStorage: AtlasGraph[] = strFromStorage ? JSON.parse(strFromStorage) : [];

		atlasStorage = atlasStorage.filter((graph: AtlasGraph) => graph.name !== saveGraph.name);
		atlasStorage.push(saveGraph);
		localStorage.setItem(this.recentGraphStorageName, JSON.stringify(atlasStorage));
	}

	public static removeGraphFromStorage = (graphName: string) => {
		const strFromStorage: string | null = localStorage.getItem(this.recentGraphStorageName);
		let atlasStorage: AtlasGraph[] = strFromStorage ? JSON.parse(strFromStorage) : [];

		atlasStorage = atlasStorage.filter((graph: AtlasGraph) => graph.name !== graphName);
		localStorage.setItem(this.recentGraphStorageName, JSON.stringify(atlasStorage));
	};

	public static getRecentGraphsFromLocalStorage(): AtlasGraph[] {
		const jsonStringWithGraphs: string | null = localStorage.getItem(
			this.recentGraphStorageName,
		);
		if (jsonStringWithGraphs === null) return [];

		const recentGraphs: AtlasGraph[] = [];
		JSON.parse(jsonStringWithGraphs).map((item: AtlasGraph) =>
			recentGraphs.push(JsonUtils.jsonToGraph(item)),
		);

		return recentGraphs;
	}
}
