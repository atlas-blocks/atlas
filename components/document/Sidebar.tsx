import React from 'react';

import styles from '../../styles/Sidebar.module.css';

function Sidebar() {
	const onDragStart = (event: React.DragEvent<HTMLDivElement>, nodeType: string) => {
		event.dataTransfer.setData('application/reactflow', nodeType);
		event.dataTransfer.effectAllowed = 'move';
	};

	return (
		<aside id={styles.sidebar}>
			<h2>Blocks Menu</h2>
			<div className={`${styles.dndnode} ${styles.default}`} onDragStart={(event) => onDragStart(event, 'defaultBlock')} draggable>
				Default
			</div>
			<div className={`${styles.dndnode} ${styles.simplify}`} onDragStart={(event) => onDragStart(event, 'simplifyBlock')} draggable>
				Simplify
			</div>
			<div className={`${styles.dndnode} ${styles.set}`} onDragStart={(event) => onDragStart(event, 'defaultBlock')} draggable>
				Set
			</div>
			<div className={`${styles.dndnode} ${styles.graph}`} onDragStart={(event) => onDragStart(event, 'defaultBlock')} draggable>
				Graph
			</div>
		</aside>
	);
}

export default Sidebar;