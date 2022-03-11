import React from 'react';
import { Handle, Position } from 'react-flow-renderer';
import styles from '../../styles/Block.module.css';
import globals from '../globals';

interface DefaultBlockProps {
	label: string;
}

export function DefaultBlock({ data }: { data: DefaultBlockProps }) {
	return (
		<div className={`${styles.block} ${styles.default}`} onClick={blockClickHandler}>
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
		<div className={`${styles.block} ${styles.simplify}`} onClick={blockClickHandler}>
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


function blockClickHandler(event: React.MouseEvent) {
}

function openMathInput() {
}
