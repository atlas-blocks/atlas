async function fetchAsync(url: RequestInfo) {
	let response = await fetch(url);
	return await response.json();
}

type Response = {
	success: boolean;
	latex: string;
};

export class ServerUtils {
	public static async getSimplify(latex: string): Promise<Response> {
		return fetchAsync('/api/simplify');
	}
}
