import styles from '../../styles/LibPanel.module.css';
import { useState } from 'react';

export default function LibPanel(props: any): JSX.Element {
	const onDragStart = (event: any, nodeType: any) => {
		event.dataTransfer.setData('application/reactflow', nodeType);
		event.dataTransfer.effectAllowed = 'move';
	};

	const libs = ['Basic', 'Symbolic', 'Graphics', 'Engineering', 'Import', 'Physical'];

	const libElements = {
		Basic: ['Expr', 'if', 'for'],
		Symbolic: ['Simplify', 'Equal'],
		Graphics: ['2D-plot', '3D-plot'],
		Engineering: ['PID Controller'],
		Import: ['JSON', 'CSV', 'XML', 'Form'],
		Physical: ['Custom Object'],
	};

	const [collapseContainer, setCollapseContainer] = useState<object>({
		Basic: '',
		Symbolic: styles.containerCollapse,
		Graphics: styles.containerCollapse,
		Engineering: styles.containerCollapse,
		Import: styles.containerCollapse,
		Physical: styles.containerCollapse,
	});

	const openLibSection = (idName: keyof typeof collapseContainer) => {
		if (collapseContainer[idName] != '') {
			setCollapseContainer((prev: object) => ({ ...prev, [idName]: '' }));
		} else {
			setCollapseContainer((prev: object) => ({
				...prev,
				[idName]: styles.containerCollapse,
			}));
		}
	};

	function loadLibElements(name: string): JSX.Element {
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

	function loadLibSections(libName: string): JSX.Element {
		return (
			<div key={libName} className={styles.wrapper}>
				<div
					id={libName}
					className={styles.libSectionLabel}
					onClick={(evt) => {
						openLibSection(evt.currentTarget.id as keyof typeof collapseContainer);
					}}
				>
					<label>
						{'>'} {libName}
					</label>
				</div>
				<div
					className={`${styles.elementsContainer} ${
						collapseContainer[libName as keyof typeof collapseContainer]
					}`}
				>
					{libElements[libName as keyof typeof libElements].map((elem: string) =>
						loadLibElements(elem),
					)}
				</div>
			</div>
		);
	}

	return (
		<div className={`${props.visibleState}`}>
			{libs.map((els: string) => loadLibSections(els))}
		</div>
	);
}
