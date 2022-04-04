import CustomNamespace from '../../../../namespaces/CustomNamespace';
import JavaScriptFunctionNode from '../../../../nodes/formulas/functions/JavaScriptFunctionNode';
import ServerUtils from '../../../../../utils/ServerUtils';
import FormulaUtils from '../../../../../utils/algorithms/FormulaUtils';

export default new CustomNamespace('', [
	new JavaScriptFunctionNode(
		FormulaUtils.TypesFunctions.map.name,
		async (args: string[]) => {
			if (args.length % 2 !== 0) throw new Error('args number should be even');
			const map = new Map<string, string>();
			for (let i = 0; i < args.length; i += 2) {
				map.set(args[i], args[i + 1]);
			}
			return JSON.stringify(Object.fromEntries(map));
		},
		[
			{ name: 'key', type: 'String' },
			{ name: 'value', type: 'String' },
		],
		'String',
	),
	new JavaScriptFunctionNode(
		'fetch',
		async (args: string[]) => {
			const url = JSON.parse(args[0]);
			const request = JSON.parse(args[1]);
			return JSON.stringify(await ServerUtils.getFetch(url, request));
		},
		[
			{ name: 'url', type: 'String' },
			{ name: 'request', type: 'String' },
		],
		'String',
	),
	new JavaScriptFunctionNode(
		'simplify',
		async (args: string[]) => {
			const response = await ServerUtils.getElSimplify(JSON.parse(args[0]));
			return response.success ? response.latex : '\\text{error during calculating}';
		},
		[{ name: 'formulaContent', type: 'String' }],
		'String',
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
		'String',
	),
]);
