import styles from '../../styles/LibPanel.module.css';
import React, { useState } from 'react';
import {
	AtlasNode,
	ExpressionNode,
	TextNode,
	FileNode,
	MatrixFilterNode,
} from '../../utils/AtlasGraph';

type Props = {
	setDruggedNode: React.Dispatch<React.SetStateAction<AtlasNode | null>>;
	libPanelStyleWrapper: string;
};

export default function LibPanel({ setDruggedNode, libPanelStyleWrapper }: Props): JSX.Element {
	const onDragStart = (event: React.DragEvent<HTMLDivElement>, node: AtlasNode) => {
		setDruggedNode(node);
		event.dataTransfer.effectAllowed = 'move';
	};

	const nodesOptions = {
		ExpressionNode: () => ExpressionNode.build().setResult('5').setContent('2 + 3'),
		TextNode: () => TextNode.build().setContent('1, 2, 3'),
		FileNode: () => FileNode.build(),
		MatrixFilterNode: () => MatrixFilterNode.build(),
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
		<div className={`${libPanelStyleWrapper}`}>
			{Object.keys(libElements).map((name) =>
				getLibSections(name as keyof typeof libCollapseStates),
			)}
		</div>
	);
}
