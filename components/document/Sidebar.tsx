import React from 'react';

import styles from '../../styles/Sidebar.module.css';
import ExpressionNode from '../../commons/nodes/formulas/ExpressionNode';

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
				onDragStart={(event) => onDragStart(event, ExpressionNode.getImport().toString())}
				draggable
			>
				{ExpressionNode.getImport().getNodeName()}
			</div>
			<div
				className={`${styles.dndnode} ${styles.simplify}`}
				onDragStart={(event) => onDragStart(event, ExpressionNode.getImport().toString())}
				draggable
			>
				SimplifyNode
			</div>
		</aside>
	);
}

export default Sidebar;
