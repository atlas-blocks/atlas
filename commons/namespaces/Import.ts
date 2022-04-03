class Import {
	private readonly user: string;
	private readonly package: string;
	private readonly nodeName: string;

	constructor(user: string, packageName: string, nodeName: string) {
		this.user = user;
		this.package = packageName;
		this.nodeName = nodeName;
	}

	public getUser(): string {
		return this.user;
	}

	public getPackage(): string {
		return this.package;
	}

	public getNodeName(): string {
		return this.nodeName;
	}

	public toString(): string {
		return this.user + '/' + this.package + '/' + this.nodeName;
	}
}

export default Import;
