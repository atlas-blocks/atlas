import styles from '../../styles/LibPanel.module.css';
import { useState } from 'react';

export default function LibPanel(props: any): JSX.Element {
	const onDragStart = (event: any, nodeType: any) => {
		event.dataTransfer.setData('application/reactflow', nodeType);
		event.dataTransfer.effectAllowed = 'move';
	};

	const libElements = {
		Basic: ['Expr', 'if', 'for'],
		Symbolic: ['Simplify', 'Equal'],
		Graphics: ['2D-plot', '3D-plot'],
		Engineering: ['PID Controller'],
		Import: ['JSON', 'CSV', 'XML', 'Form'],
		Physical: ['Custom Object'],
	};

	const libColapseStates = {
		Basic: useState<string>(''),
		Symbolic: useState<string>(styles.containerCollapse),
		Graphics: useState<string>(styles.containerCollapse),
		Engineering: useState<string>(styles.containerCollapse),
		Import: useState<string>(styles.containerCollapse),
		Physical: useState<string>(styles.containerCollapse),
	};

	const openOrColapseLibSection = (idName: keyof typeof libColapseStates): void => {
		libColapseStates[idName][1](
			libColapseStates[idName][0] === '' ? styles.containerCollapse : '',
		);
	};

	function getLibElements(name: string): JSX.Element {
		return (
			<div
				key={name}
				className={styles.elementSingle}
				onDragStart={(event) => onDragStart(event, 'expressionNode')}
				draggable
			>
				<span>{name}</span>
			</div>
		);
	}

	function getLibSections(libName: keyof typeof libElements): JSX.Element {
		return (
			<div key={libName} className={styles.wrapper}>
				<div
					id={libName}
					className={styles.libSectionLabel}
					onClick={(evt) => {
						openOrColapseLibSection(evt.currentTarget.id as keyof typeof libElements);
					}}
				>
					<label>
						{'>'} {libName}
					</label>
				</div>
				<div className={`${styles.elementsContainer} ${libColapseStates[libName][0]}`}>
					{libElements[libName].map((elem) => getLibElements(elem))}
				</div>
			</div>
		);
	}

	return (
		<div className={`${props.visibleState}`}>
			{Object.keys(libElements).map((name) =>
				getLibSections(name as keyof typeof libColapseStates),
			)}
		</div>
	);
}
