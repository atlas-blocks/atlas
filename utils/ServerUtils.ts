async function fetchAsync(url: RequestInfo) {
	let response = await fetch(url);
	return await response.json();
}

type Response = {
	success: boolean;
	latex: string;
};

function toBase64(str: string): string {
	return Buffer.from(str).toString('base64');
}

function fromBase64(str: string): string {
	return Buffer.from(str, 'base64').toString('ascii');
}

export class ServerUtils {
	public static async getSimplify(latex: string): Promise<Response> {
		return fetchAsync('/api/simplify?latex=' + toBase64(latex));
	}

	public static async getElSimplify(latex: string): Promise<Response> {
		return fetchAsync('/api/el_simplify?latex=' + toBase64(latex));
	}
}
