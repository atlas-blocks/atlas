import React, { useState } from 'react';
import Node from '../../commons/nodes/Node';

import styles from '../../styles/BlockMenu.module.css';
import ExpressionNode from '../../commons/nodes/formulas/ExpressionNode';
import WebInterfaceUtils from '../../utils/WebInterfaceUtils';

type Props = {
	selectedNode: Node | null;
	setDruggedNode: React.Dispatch<React.SetStateAction<Node | null>>;
	webInterfaceUtils: WebInterfaceUtils;
};

function BlockMenu({ selectedNode, setDruggedNode, webInterfaceUtils }: Props) {
	const onDragStart = (event: React.DragEvent<HTMLDivElement>, node: Node) => {
		setDruggedNode(node);
		event.dataTransfer.effectAllowed = 'move';
	};
	const elementWidth = '250px';

	return (
		<aside
			id={styles.block_menu}
			style={{ right: selectedNode !== null ? '-' + elementWidth : '0', width: elementWidth }}
		>
			<h2>Blocks Menu</h2>
			<h3>blocks</h3>
			<div
				className={`${styles.dndnode} ${styles.default}`}
				onDragStart={(event) => onDragStart(event, new ExpressionNode('', '', 0))}
				draggable
			>
				{ExpressionNode.getImport().getNodeName()}
			</div>

			<h3>functions</h3>
			<div style={{textAlign:'left'}}
				className={`${styles.dndnode} ${styles.function}`}
				onDragStart={(event) =>
					onDragStart(event, new ExpressionNode('', 'simplify("1 + 1")', 0))
				}
				draggable
			>
				<div className={styles.display_linebreak}>
					{webInterfaceUtils.getFunctionSignature('simplify', true)}
				</div>
			</div>
			<div style={{textAlign:'left'}}
				className={`${styles.dndnode} ${styles.function}`}
				onDragStart={(event) =>
					onDragStart(event, new ExpressionNode('', 'str(1 + 1")', 0))
				}
				draggable
			>
				<div className={styles.display_linebreak}>
					{webInterfaceUtils.getFunctionSignature('str', true)}
				</div>
			</div>
			<div
				className={`${styles.dndnode} ${styles.function}`}
				onDragStart={(event) =>
					onDragStart(
						event,
						new ExpressionNode(
							'',
							'fetch("http://localhost:3000/api/el_simplify", {"latex":"1+1"})',
							0,
						),
					)
				}
				draggable
			>
				<div className={styles.display_linebreak}>
					{webInterfaceUtils.getFunctionSignature('fetch', true)}
				</div>
			</div>
		</aside>
	);
}

export default BlockMenu;
