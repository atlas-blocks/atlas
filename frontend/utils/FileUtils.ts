import AtlasGraph from './AtlasGraph';

export default class FileUtils {
	public static convertToJson(graph: AtlasGraph): string {
		return JSON.stringify(graph, null, 2);
	}

	public static readonly filetypeMap = {
		json: 'application/json',
		ca: 'application/json',
	};

	public static readonly converterMap = {
		json: this.convertToJson,
		ca: this.convertToJson,
	};

	public static makeUserDownloadFile(
		content: string,
		filename: string,
		extension: keyof typeof this.filetypeMap,
	): void {
		const blob = new Blob([content], { type: this.filetypeMap[extension] });
		const href = URL.createObjectURL(blob);
		const link = document.createElement('a');
		link.href = href;
		link.download = filename + '.' + extension;
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
	}

	public static makeUserDownloadFileFromGraph(
		graph: AtlasGraph,
		extension: keyof typeof this.filetypeMap,
	): void {
		this.makeUserDownloadFile(this.converterMap[extension](graph), graph.name, extension);
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
