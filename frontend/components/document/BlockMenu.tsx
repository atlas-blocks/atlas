import React, { useState } from 'react';
import { AtlasNode, ExpressionNode, TextNode, FileNode } from '../../utils/AtlasGraph';

import styles from '../../styles/BlockMenu.module.css';
import blockStyles from '../../styles/Block.module.css';
import WebInterfaceUtils from '../../utils/WebInterfaceUtils';

type Props = {
	selectedNode: AtlasNode | null;
	setDruggedNode: React.Dispatch<React.SetStateAction<AtlasNode | null>>;
	webInterfaceUtils: WebInterfaceUtils;
};

function BlockMenu({ selectedNode, setDruggedNode, webInterfaceUtils }: Props) {
	const onDragStart = (event: React.DragEvent<HTMLDivElement>, node: AtlasNode) => {
		setDruggedNode(node);
		event.dataTransfer.effectAllowed = 'move';
	};
	const elementWidth = '250px';

	const nodesOptions = {
		ExpressionNode: () =>
			new ExpressionNode(
				new AtlasNode(ExpressionNode.structType, '', 'pkg', [0, 0], true),
				'2 + 3',
				'5',
			),
		TextNode: () =>
			new TextNode(
				new AtlasNode(TextNode.structType, 'name1', 'pkg', [0, 0], true),
				'1, 2, 3',
			),
		FileNode: () =>
			new FileNode(new AtlasNode(FileNode.structType, 'name1', 'pkg', [0, 0], true), '', ''),
	};
	const getNodeOption = (option: keyof typeof nodesOptions) => (
		<div
			key={option}
			className={`${styles.dndnode} ${blockStyles.text_block}`}
			onDragStart={(event) => onDragStart(event, nodesOptions[option]())}
			draggable
		>
			{option}
		</div>
	);

	return (
		<aside
			id={styles.block_menu}
			// style={{ right: selectedNode !== null ? '-' + elementWidth : '0', width: elementWidth }}
		>
			<h2>Blocks Menu</h2>
			<h3>blocks</h3>
			{Object.keys(nodesOptions).map((option) =>
				getNodeOption(option as keyof typeof nodesOptions),
			)}
		</aside>
	);
}

export default BlockMenu;
