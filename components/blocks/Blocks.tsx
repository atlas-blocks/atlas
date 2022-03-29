import React from 'react';
import { Handle, Position } from 'react-flow-renderer';
import styles from '../../styles/Block.module.css';
import Node from '../../commons/nodes/Node';
import ExpressionNode from '../../commons/nodes/formulas/ExpressionNode';
import SimplifyNode from '../../commons/nodes/formulas/SimplifyNode';
import NodeTypeNames from '../../commons/nodes/NodeTypeNames';

export const nodeTypes = {
	[NodeTypeNames.ExpressionNode]: ExpressionBlock,
	[NodeTypeNames.SimplifyNode]: SimplifyBlock,
};

interface DefaultBlockProps {
	node: Node;
}

export function FormulaBlockWrapper(content: JSX.Element) {
	return (
		<div className={`${styles.block} ${styles.default}`}>
			<Handle type="target" position={Position.Top} />
			{content}
			<Handle type="source" position={Position.Bottom} id="a" />
		</div>
	);
}

export function ExpressionBlock({ data }: { data: { node: ExpressionNode } }) {
	return FormulaBlockWrapper(<div>{data.node.toLatex()}</div>);
}

export function SimplifyBlock({ data }: { data: { node: SimplifyNode } }) {
	return (
		<div className={`${styles.block} ${styles.simplify}`}>
			<Handle type="target" position={Position.Top} />
			<div>{data.node.toLatex()}</div>
			<Handle type="source" position={Position.Bottom} id="a" />
		</div>
	);
}
