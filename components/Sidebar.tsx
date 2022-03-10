import React from 'react';

import styles from '../styles/Sidebar.module.css';

function Sidebar() {
	const onDragStart = (event: React.DragEvent<HTMLDivElement>, nodeType: string) => {
		event.dataTransfer.setData('application/reactflow', nodeType);
		event.dataTransfer.effectAllowed = 'move';
	};

	return (
		<aside id={styles.sidebar}>
			<h2>Blocks Menu</h2>
			<div className={`${styles.dndnode} ${styles.input}`} onDragStart={(event) => onDragStart(event, 'input')} draggable>
				Input Node
			</div>
			<div className={`${styles.dndnode}`} onDragStart={(event) => onDragStart(event, 'default')} draggable>
				Default Node
			</div>
			<div className={`${styles.dndnode} ${styles.output}`} onDragStart={(event) => onDragStart(event, 'output')} draggable>
				Output Node
			</div>
		</aside>
	);
};

export default Sidebar;