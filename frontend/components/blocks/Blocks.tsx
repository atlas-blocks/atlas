import React from 'react';
import { Handle, Position } from 'react-flow-renderer';
import styles from '../../styles/Block.module.css';
import { AtlasNode, ExpressionNode, TextNode } from '../../utils/AtlasGraph';

export const nodeTypes = {
	[ExpressionNode.structType]: ExpressionBlock,
	[TextNode.structType]: TextBlock,
};

export function FormulaBlockWrapper(content: JSX.Element, blockClass: string) {
	return (
		<div className={`${styles.block} ${blockClass}`}>
			<Handle type="target" position={Position.Left} />
			<Handle type="source" position={Position.Right} id="a" />
			<div className={styles.display_linebreak}>{content}</div>
		</div>
	);
}

export function TextBlock({ data }: { data: { node: TextNode } }) {
	return FormulaBlockWrapper(
		<div className={`${styles.text_block}`}>
			<div>
				<span className={styles.attribute_name}>name:</span> {data.node.name}
			</div>
			<div>
				<span className={styles.attribute_name}>content:</span>
				<br /> {data.node.content}
			</div>
		</div>,
		styles.text_block,
	);
}

export function ExpressionBlock({ data }: { data: { node: ExpressionNode } }) {
	return FormulaBlockWrapper(
		<div>
			<div>
				<span className={styles.attribute_name}>name:</span> {data.node.name}
			</div>
			<div>
				<span className={styles.attribute_name}>content:</span> {data.node.content}
			</div>
			<div>
				<span className={styles.attribute_name}>result:</span> {data.node.result}
			</div>
		</div>,
		styles.expression_block,
	);
}

// export function FunctionBlock({ data }: { data: { node: FunctionNode } }) {
// 	return FormulaBlockWrapper(
// 		<div>
// 			<div>
// 				name: {data.node.getName()}(
// 				{data.node
// 					.getArgs()
// 					.map((arg) => arg.name + ': ' + arg.type)
// 					.join(', ')}
// 				)
// 			</div>
// 		</div>,
// 	);
// }