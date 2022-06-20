import AtlasGraph from './AtlasGraph';
import JsonUtils from './JsonUtils';

export default class FileUtils {
	private static convertGraphToJson(graph: AtlasGraph): string {
		return JsonUtils.stringify(graph, 2);
	}

	// public static readonly filetypeMap = {
	// 	json: 'application/json',
	// 	ca: 'application/json',
	// };

	// public static readonly converterMap = {
	// 	json: this.convertGraphToJson,
	// 	ca: this.convertGraphToJson,
	// };

	public static makeUserDownloadFile(content: string, filename: string, extension: string): void {
		const blob = new Blob([content], { type: 'application/json' });
		const href = URL.createObjectURL(blob);
		const link = document.createElement('a');
		link.href = href;
		link.download = filename + '.' + extension;
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
	}

	public static makeUserDownloadFileFromGraph(graph: AtlasGraph, extension: string): void {
		this.makeUserDownloadFile(JsonUtils.stringify(graph, 2), graph.name, extension);
	}

	public static getFileContentString(filepath: File, callback: (string: string) => any): void {
		const reader = new FileReader();
		reader.onload = (evt: ProgressEvent<FileReader>) => {
			callback(reader.result === null ? '' : reader.result.toString());
		};
		reader.onerror = () => {
			window.alert('Error while loading file');
			callback('');
		};
		reader.readAsText(filepath);
	}
}
