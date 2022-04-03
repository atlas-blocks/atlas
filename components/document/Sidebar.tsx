import React from 'react';
import Node from '../../commons/nodes/Node';

import styles from '../../styles/Sidebar.module.css';
import ExpressionNode from '../../commons/nodes/formulas/ExpressionNode';

type Props = {
	setDruggedNode: React.Dispatch<React.SetStateAction<Node | null>>;
};

function Sidebar({ setDruggedNode }: Props) {
	const onDragStart = (event: React.DragEvent<HTMLDivElement>, node: Node) => {
		setDruggedNode(node);
		event.dataTransfer.effectAllowed = 'move';
	};

	return (
		<aside id={styles.sidebar}>
			<h2>Blocks Menu</h2>
			<div
				className={`${styles.dndnode} ${styles.default}`}
				onDragStart={(event) => onDragStart(event, new ExpressionNode('', '', 0))}
				draggable
			>
				{ExpressionNode.getImport().getNodeName()}
			</div>
			<div
				className={`${styles.dndnode} ${styles.simplify}`}
				onDragStart={(event) =>
					onDragStart(event, new ExpressionNode('', 'simplify ( "1 + 1" ) ', 0))
				}
				draggable
			>
				SimplifyNode
			</div>
		</aside>
	);
}

export default Sidebar;
