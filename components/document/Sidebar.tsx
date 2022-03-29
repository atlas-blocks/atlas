import React from 'react';

import styles from '../../styles/Sidebar.module.css';
import ExpressionNode from '../../commons/nodes/formulas/ExpressionNode';
import SimplifyNode from '../../commons/nodes/formulas/SimplifyNode';

function Sidebar() {
	const onDragStart = (event: React.DragEvent<HTMLDivElement>, nodeType: string) => {
		event.dataTransfer.setData('application/reactflow', nodeType);
		event.dataTransfer.effectAllowed = 'move';
	};

	return (
		<aside id={styles.sidebar}>
			<h2>Blocks Menu</h2>
			<div
				className={`${styles.dndnode} ${styles.default}`}
				onDragStart={(event) => onDragStart(event, ExpressionNode.name)}
				draggable
			>
				{ExpressionNode.name}
			</div>
			<div
				className={`${styles.dndnode} ${styles.simplify}`}
				onDragStart={(event) => onDragStart(event, SimplifyNode.name)}
				draggable
			>
				{SimplifyNode.name}
			</div>
			<div
				className={`${styles.dndnode} ${styles.set}`}
				onDragStart={(event) => onDragStart(event, ExpressionNode.name)}
				draggable
			>
				Set
			</div>
			<div
				className={`${styles.dndnode} ${styles.graph}`}
				onDragStart={(event) => onDragStart(event, ExpressionNode.constructor.name)}
				draggable
			>
				Graph
			</div>
		</aside>
	);
}

export default Sidebar;
