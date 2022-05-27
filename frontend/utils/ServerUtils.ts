import ErrorUtils from './errors/ErrorUtils';
import AtlasGraph, { AtlasEdge, AtlasNode, ExpressionNode, TextNode, FileNode } from './AtlasGraph';

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

	public static async updateGraph(graph: AtlasGraph) {
		const graphJsonStr: string = JSON.stringify({ nodes: graph.nodes, edges: graph.edges });
		const responseJson = await this.post(
			this.getHostHref() + '/api/graph',
			{},
			{ graph: graph },
		);
		if (!responseJson.success) {
			ErrorUtils.showAlert('error while updating graph: ' + responseJson.message);
			return;
		}
		const updatedGraph = responseJson.graph;
		updatedGraph.nodes = ServerUtils.extractNodes(updatedGraph.nodes);
		updatedGraph.edges = ServerUtils.extractEdges(updatedGraph.edges);
		Object.assign(graph, updatedGraph);
	}

	public static extractNodes(nodes: { type: string }[]): AtlasNode[] {
		const updatedNodes: AtlasNode[] = [];
		for (const node of nodes) {
			if (node.type === ExpressionNode.structType) {
				updatedNodes.push(Object.assign(ExpressionNode.constructorEmpty(), node));
			} else if (node.type === TextNode.structType) {
				updatedNodes.push(Object.assign(TextNode.constructorEmpty(), node));
			} else if (node.type === FileNode.structType) {
				updatedNodes.push(Object.assign(FileNode.constructorEmpty(), node));
			} else if (node.type === AtlasNode.structType) {
				updatedNodes.push(Object.assign(AtlasNode.constructorEmpty(), node));
			} else {
				throw new Error('no such node type: ' + node.type);
			}
		}
		return updatedNodes;
	}
	public static extractEdges(edges: []): AtlasEdge[] {
		const updated: AtlasEdge[] = [];

		for (const edge of edges) {
			updated.push(Object.assign(AtlasEdge.constructorEmpty(), edge));
		}

		return updated;
	}
}

export default ServerUtils;
