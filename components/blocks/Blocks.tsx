import React from 'react';
import { Handle, Position } from 'react-flow-renderer';
import styles from '../../styles/Block.module.css';

export const nodeTypes = {
	defaultBlock: DefaultBlock,
	simplifyBlock: SimplifyBlock,
};

interface DefaultBlockProps {
	label: string;
	setCurrentSelectionID: (str: string) => void;
}

export function DefaultBlock({ data }: { data: DefaultBlockProps }) {
	return (
		<div className={`${styles.block} ${styles.default}`}>
			<Handle
				type='target'
				position={Position.Top}
			/>
			<div>{data.label}</div>
			<Handle
				type='source'
				position={Position.Bottom}
				id='a'
			/>
		</div>
	);
}

export function SimplifyBlock({ data }: { data: DefaultBlockProps }) {


	return (
		<div className={`${styles.block} ${styles.simplify}`}>
			<Handle
				type='target'
				position={Position.Top}
			/>
			<div>{data.label}</div>
			<Handle
				type='source'
				position={Position.Bottom}
				id='a'
			/>
		</div>
	);
}


function openMathInput() {
}
