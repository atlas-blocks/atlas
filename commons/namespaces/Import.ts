class Import {
	user: string;
	package: string;
	nodeName: string;

	constructor(user: string, packageName: string, nodeName: string) {
		this.user = user;
		this.package = packageName;
		this.nodeName = nodeName;
	}
}

export default Import;
