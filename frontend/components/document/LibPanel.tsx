import styles from '../../styles/LibPanel.module.css';
import { wiu } from '../../utils/WebInterfaceUtils';
import React, { useState } from 'react';
import {
	AtlasNode,
	ExpressionNode,
	TextNode,
	FileNode,
	MatrixFilterNode,
	SelectionNode,
	ObjectNode,
	GroupNode,
} from '../../utils/AtlasGraph';

export default function LibPanel(): JSX.Element {
	const onDragStart = (event: React.DragEvent<HTMLDivElement>, node: AtlasNode) => {
		wiu.setDruggedNode(node);
		event.dataTransfer.effectAllowed = 'move';
	};

	const nodesOptions = {
		ExpressionNode: () =>
			ExpressionNode.build().setResult('5').setContent('2 + 3').setDefaultName(wiu.graph),
		TextNode: () => TextNode.build().setContent('1, 2, 3').setDefaultName(wiu.graph),
		FileNode: () => FileNode.build().setDefaultName(wiu.graph),
		MatrixFilterNode: () => MatrixFilterNode.build().setDefaultName(wiu.graph),
		SelectionNode: () => SelectionNode.build().setDefaultName(wiu.graph),
		ObjectNode: () => ObjectNode.build().setDefaultName(wiu.graph),
		GroupNode: () => GroupNode.build().setDefaultName(wiu.graph),
	};

	const libElements = {
		// Symbolic: ['Simplify', 'Equal'],
		// Graphics: ['2D-plot', '3D-plot'],
		// Engineering: ['PID Controller'],
		// Import: ['JSON', 'CSV', 'XML', 'Form'],
		// Physical: ['Custom Object'],
		Basic: nodesOptions,
		Symbolic: nodesOptions,
		Graphics: nodesOptions,
		Engineering: nodesOptions,
		Import: nodesOptions,
		Physical: nodesOptions,
	};

	const libCollapseStates = {
		Basic: useState<string>(''),
		Symbolic: useState<string>(styles.containerCollapse),
		Graphics: useState<string>(styles.containerCollapse),
		Engineering: useState<string>(styles.containerCollapse),
		Import: useState<string>(styles.containerCollapse),
		Physical: useState<string>(styles.containerCollapse),
	};

	const openOrCollapseLibSection = (idName: keyof typeof libCollapseStates): void => {
		libCollapseStates[idName][1](
			libCollapseStates[idName][0] === '' ? styles.containerCollapse : '',
		);
	};

	function getShortName(name: keyof typeof nodesOptions): string {
		return name.slice(0, 4);
	}

	function getLibElements(name: keyof typeof nodesOptions): JSX.Element {
		return (
			<div
				key={name}
				className={styles.elementSingle}
				onDragStart={(event) => onDragStart(event, nodesOptions[name]())}
				draggable
			>
				<span>{getShortName(name)}</span>
			</div>
		);
	}

	function getLibSections(libName: keyof typeof libElements): JSX.Element {
		return (
			<div key={libName} className={styles.libWrapper}>
				<div
					id={libName}
					className={styles.libSectionLabel}
					onClick={(evt) => {
						openOrCollapseLibSection(evt.currentTarget.id as keyof typeof libElements);
					}}
				>
					<label>
						{'>'} {libName}
					</label>
				</div>
				<div className={`${styles.elementsContainer} ${libCollapseStates[libName][0]}`}>
					{Object.keys(libElements[libName]).map((elem) =>
						getLibElements(elem as keyof typeof nodesOptions),
					)}
				</div>
			</div>
		);
	}

	return (
		<>
			{Object.keys(libElements).map((name) =>
				getLibSections(name as keyof typeof libCollapseStates),
			)}
		</>
	);
}
