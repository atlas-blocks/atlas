type Response = {
	success: boolean;
	latex: string;
};

abstract class ServerUtils {
	public static async fetchAsync(urlString: string, params: any, settings = {}): Promise<any> {
		const url = new URL(urlString);
		Object.keys(params).forEach((key) => url.searchParams.append(key, params[key]));
		return await (await fetch(url.toString(), settings)).json();
	}

	public static async get(url: string, params: Object) {
		return this.fetchAsync(url, params, { method: 'GET' });
	}

	public static async post(url: string, params: Object, body: Object) {
		return this.fetchAsync(url, params, { method: 'POST', body: body });
	}

	public static async getRelativeUrl(url: string, params: Object) {
		const hostHref = window.location.href.replace(window.location.pathname, '');
		return this.fetchAsync(hostHref + url, params, { method: 'GET' });
	}

	public static async getSimplify(latex: string): Promise<Response> {
		return await this.getRelativeUrl('/api/simplify', { latex: latex });
	}

	public static async getElSimplify(latex: string): Promise<Response> {
		return await this.getRelativeUrl('/api/el_simplify', { latex: latex });
	}
}

export default ServerUtils;
