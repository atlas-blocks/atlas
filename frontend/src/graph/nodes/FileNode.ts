import TextNode from './TextNode';

export default class FileNode extends TextNode {
	static ui_type = 'AtlasGraph.FileNode';
	public ui_filename: string;

	constructor() {
		super();
		this.ui_type = FileNode.ui_type;
		this.ui_filename = '';
	}

	public setUiFilename(filename: string) {
		this.ui_filename = filename;
	}

	public static build(): FileNode {
		return new FileNode();
	}
}
