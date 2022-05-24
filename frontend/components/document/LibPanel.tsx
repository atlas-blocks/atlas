import styles from '../../styles/LibPanel.module.css';
import { useState } from 'react';

export default function LibPanel(props: any) {
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

	const [collapseContainer, setCollapseContainer] = useState<any>({
		Basic: '',
		Symbolic: styles.containerCollapse,
		Graphics: styles.containerCollapse,
		Engineering: styles.containerCollapse,
		Import: styles.containerCollapse,
		Physical: styles.containerCollapse,
	});

	const openLibSection = (idName: keyof typeof collapseContainer) => {
		if (collapseContainer[idName] != '') {
			setCollapseContainer((prev: any) => ({ ...prev, [idName]: '' }));
		} else {
			setCollapseContainer((prev: any) => ({ ...prev, [idName]: styles.containerCollapse }));
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

	function loadLibSections(libName: keyof typeof libElements): JSX.Element {
		return (
			<div key={libName} className={styles.wrapper}>
				<div
					id={libName}
					className={styles.libSectionLabel}
					onClick={(evt) => {
						openLibSection(evt.currentTarget.id);
					}}
				>
					<label>
						{' '}
						{'>'} {libName}
					</label>
				</div>
				<div className={`${styles.elementsContainer} ${collapseContainer[libName]}`}>
					{libElements[libName].map((elem) => loadLibElements(elem))}
				</div>
			</div>
		);
	}

	return (
		<div className={`${props.visibleState}`}>
			{Object.keys(libElements).map((els: any) => loadLibSections(els))}
		</div>
	);
}
