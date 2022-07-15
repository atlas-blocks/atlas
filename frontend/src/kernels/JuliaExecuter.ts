import AtlasNode from '../graph/nodes/AtlasNode';
import TextNode from '../graph/nodes/TextNode';
import ExpressionNode, { ExecutionResponse } from '../graph/nodes/ExpressionNode';
import AtlasEdge from '../graph/edges/AtlasEdge';
import AtlasGraph from '../graph/AtlasGraph';
import { Kernel, KernelAPI, KernelManager } from '@jupyterlab/services';

export default class JuliaExecuter {
	kernelId: string | null = null;
	kernel: Kernel.IKernelConnection | null = null;

	constructor() {
		(async () => {
			const kernelManager = new KernelManager();
			const kernelModels = await KernelAPI.listRunning();
			this.kernelId = kernelModels[0].id;
			this.kernel = kernelManager.connectTo({ model: kernelModels[0] });
		})();
	}

	public getExpressionCode(node: ExpressionNode): string {
		return node.name + ' = ' + node.content;
	}

	public getTextCode(node: TextNode): string {
		return node.name + ' = """' + node.content + '"""';
	}

	public getAtlasNodeCode(node: AtlasNode): string {
		const typeMap = {
			[ExpressionNode.ui_type]: this.getExpressionCode,
			[TextNode.ui_type]: this.getTextCode,
		};
		return typeMap[node.type](node as any);
	}

	public async executeCodeLines(codeLines: string[]): Promise<ExecutionResponse> {
		return await this.executeCode(codeLines.join('\n'));
	}
	public async executeCode(code: string): Promise<ExecutionResponse> {
		const response = new ExecutionResponse();

		const future = this.kernel!.requestExecute({ code: code });
		future.onIOPub = (msg) => {
			if (msg.header.msg_type == 'execute_result') {
				response.result.push((msg.content as any).data);
			} else if (msg.header.msg_type == 'stream') {
				response.result.push({ 'text/plain': (msg.content as any).text });
			} else if (msg.header.msg_type == 'error') {
				response.error = {
					value: (msg.content as any).evalue,
					traceback: (msg.content as any).traceback,
				};
			}
		};
		await future.done;
		return response;
	}

	public async executeAtlasNode(node: AtlasNode): Promise<void> {
		if (this.kernel === null) return;

		const response = await this.executeCode(this.getAtlasNodeCode(node));

		if (node instanceof ExpressionNode) {
			node.response = response;

			for (const content of node.helper_contents) {
				node.helper_responses = [];
				node.helper_responses.push(await this.executeCode(content));
			}

			node.providerNames = await this.getProviderNames(node.content);
		}
	}

	public async getProviderNames(content: string): Promise<string[]> {
		const response = await this.executeCodeLines([
			'import AtlasUtils.TokenUtils, JSON3',
			'print(JSON3.write(TokenUtils.getnames("""' + content + '""")))',
		]);

		try {
			const names = JSON.parse(response.getPlainTextResultString());
			if (Array.isArray(names)) return names;
		} catch (ignored) {
			console.error(response, ' should be an array of string names');
		}
		return [];
	}
}
