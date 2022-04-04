import CustomNamespace from '../../../../namespaces/CustomNamespace';
import JavaScriptFunctionNode from '../../../../nodes/formulas/functions/JavaScriptFunctionNode';
import ServerUtils from '../../../../../utils/ServerUtils';

export default new CustomNamespace('', [
	new JavaScriptFunctionNode(
		'fetch',
		async (args: string[]) => {
			const url = JSON.parse(args[0]);
			const request = JSON.parse(args[1]);
			return JSON.stringify(await ServerUtils.post(url, request, request));
		},
		[
			{ name: 'url', type: 'String' },
			{ name: 'request', type: 'String' },
		],
		'string',
	),
	new JavaScriptFunctionNode(
		'simplify',
		async (args: string[]) => {
			const response = await ServerUtils.getElSimplify(JSON.parse(args[0]));
			return response.success ? response.latex : '\\text{error during calculating}';
		},
		[{ name: 'formulaContent', type: 'String' }],
		'string',
	),
	new JavaScriptFunctionNode(
		'getMapField',
		async (args: string[]) => {
			const map = JSON.parse(args[0]);
			const field = JSON.parse(args[1]);
			return JSON.stringify(map[field]);
		},
		[
			{ name: 'map', type: 'String' },
			{ name: 'field', type: 'String' },
		],
		'string',
	),
]);