import AtlasGraph from './AtlasGraph';

export default class StorageUtils {
	public static saveGraphToLocalStorage(saveGraph: AtlasGraph) {
		const strFromStorage: string | null = localStorage.getItem('AtlasStorage');
		let atlasStorage: AtlasGraph[] = strFromStorage ? JSON.parse(strFromStorage) : [];

		atlasStorage = atlasStorage.filter((graph: AtlasGraph) => graph.name !== saveGraph.name);
		atlasStorage.push(saveGraph);
		localStorage.setItem('AtlasStorage', JSON.stringify(atlasStorage));
	}

	public static removeGraphFromStorage = (graphName: string) => {
		const strFromStorage: string | null = localStorage.getItem('AtlasStorage');
		let atlasStorage: AtlasGraph[] = strFromStorage ? JSON.parse(strFromStorage) : [];

		atlasStorage = atlasStorage.filter((graph: AtlasGraph) => graph.name !== graphName);
		localStorage.setItem('AtlasStorage', JSON.stringify(atlasStorage));
	};
}
