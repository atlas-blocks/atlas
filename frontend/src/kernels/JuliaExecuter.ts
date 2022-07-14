import AtlasNode from '../graph/nodes/AtlasNode';
import TextNode from '../graph/nodes/TextNode';
import ExpressionNode from '../graph/nodes/ExpressionNode';
import JupyterUtils from '../utils/JupyterUtils';
import { Kernel, KernelAPI, KernelManager, KernelMessage } from '@jupyterlab/services';

export default class JuliaExecuter {
	kernelId: string | null = null;
	kernel: Kernel.IKernelConnection | null = null;
	sessionId: string = JupyterUtils.generateRandomHex(32);
	supportedProtocols = ['ws'];

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

	public getCode(node: AtlasNode): string {
		const typeMap = {
			[ExpressionNode.ui_type]: this.getExpressionCode,
			[TextNode.ui_type]: this.getTextCode,
		};
		return typeMap[node.type](node as any);
	}
}
