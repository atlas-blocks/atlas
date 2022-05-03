import React from 'react';
import { Handle, Position } from 'react-flow-renderer';
import styles from '../../styles/Block.module.css';
import Node from '../../commons/nodes/Node';
import { AtlasNode, ExpressionNode } from '../../utils/AtlasGraph';
import FunctionNode from '../../commons/nodes/formulas/functions/FunctionNode';
import FormulaNode from '../../commons/nodes/formulas/FormulaNode';
import JavaScriptFunctionNode from '../../commons/nodes/formulas/functions/JavaScriptFunctionNode';

export const nodeTypes = {
	[ExpressionNode.structType]: ExpressionBlock,
	[FormulaNode.getImport().toString()]: FunctionBlock,
	[JavaScriptFunctionNode.getImport().toString()]: FunctionBlock,
};

interface DefaultBlockProps {
	node: Node;
}

export function FormulaBlockWrapper(content: JSX.Element) {
	return (
		<div className={`${styles.block} ${styles.default}`}>
			<Handle type="target" position={Position.Left} />
			<Handle type="source" position={Position.Right} id="a" />
			{content}
		</div>
	);
}

export function ExpressionBlock({ data }: { data: { node: ExpressionNode } }) {
	return FormulaBlockWrapper(
		<div>
			<div>
				<span className={styles.attribute_name}>name:</span> {data.node.name}
			</div>
			<div>
				<span className={styles.attribute_name}>content:</span>{' '}
				{data.node.content.replaceAll('__$', '').replaceAll('$__', '')}
			</div>
			<div>
				<span className={styles.attribute_name}>result:</span> {data.node.result}
			</div>
		</div>,
	);
}

export function FunctionBlock({ data }: { data: { node: FunctionNode } }) {
	return FormulaBlockWrapper(
		<div>
			<div>
				name: {data.node.getName()}(
				{data.node
					.getArgs()
					.map((arg) => arg.name + ': ' + arg.type)
					.join(', ')}
				)
			</div>
		</div>,
	);
}
