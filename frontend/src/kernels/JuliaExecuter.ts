import AtlasNode from '../graph/nodes/AtlasNode';
import TextNode from '../graph/nodes/TextNode';
import ExpressionNode from '../graph/nodes/ExpressionNode';
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

	public async executeAtlasNode(node: AtlasNode): Promise<void> {
		if (this.kernel === null) return;

		if (node instanceof ExpressionNode) {
			node.result = [];
			node.error = null;
		}
		const code = this.getAtlasNodeCode(node);
		const future = this.kernel!.requestExecute({ code: code });

		future.onIOPub = (msg) => {
			if (node instanceof ExpressionNode) {
				if (msg.header.msg_type == 'execute_result') {
					node.result.push((msg.content as any).data);
				} else if (msg.header.msg_type == 'stream') {
					node.result.push({ 'text/plain': (msg.content as any).text });
				} else if (msg.header.msg_type == 'error') {
					node.error = {
						value: (msg.content as any).evalue,
						traceback: (msg.content as any).traceback,
					};
				}
			}
		};
		await future.done;
	}
}
