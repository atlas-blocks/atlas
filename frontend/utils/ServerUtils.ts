import ErrorUtils from './errors/ErrorUtils';
import AtlasGraph from './AtlasGraph';
import JsonUtils from './JsonUtils';

type Response = {
	success: boolean;
	latex: string;
};

export default abstract class ServerUtils {
	public static async fetchAsync(urlString: string, params: any, settings = {}): Promise<any> {
		const url = new URL(urlString);
		Object.keys(params).forEach((key) => url.searchParams.append(key, params[key]));
		return await (await fetch(url.toString(), settings)).json();
	}

	public static async get(url: string, params: Object) {
		return this.fetchAsync(url, params, { method: 'GET' });
	}

	public static async post(url: string, params: Object, body: Object) {
		return this.fetchAsync(url, params, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(body),
		});
	}

	public static getHostHref(): string {
		if (typeof window !== 'undefined')
			return window.location.href.replace(window.location.pathname, '');
		throw new Error('this should be executed on client');
	}

	public static toAbsoluteUrl(url: string): string {
		if (url.startsWith('http')) return url;
		return this.getHostHref() + url;
	}

	public static async getSimplify(latex: string): Promise<Response> {
		return await this.get(this.getHostHref() + '/api/simplify', { latex: latex });
	}

	public static async getElSimplify(latex: string): Promise<Response> {
		return await this.get(this.getHostHref() + '/api/el_simplify', { latex: latex });
	}

	public static async getFetch(url: string, data: object): Promise<any> {
		if (url != this.toAbsoluteUrl(url))
			return await ServerUtils.get(ServerUtils.toAbsoluteUrl(url), data);
		return await ServerUtils.get(ServerUtils.toAbsoluteUrl('/api/fetch'), {
			url: url,
			request: JSON.stringify(data),
		});
	}

	public static async getUpdatedGraph(graph: AtlasGraph): Promise<AtlasGraph | null> {
		const responseJson = await this.post(
			this.getHostHref() + '/api/graph',
			{},
			{ graph: graph },
		);
		if (!responseJson.success) {
			ErrorUtils.showAlert('error while updating graph: ' + responseJson.message);
			return null;
		}

		return JsonUtils.jsonToGraph(responseJson.graph);
	}
}
