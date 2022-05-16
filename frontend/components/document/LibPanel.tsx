import styles from '../../styles/LibPanel.module.css';

export default function LibPanel(props: any) {
	const onDragStart = (event: any, nodeType: any) => {
		event.dataTransfer.setData('application/reactflow', nodeType);
		event.dataTransfer.effectAllowed = 'move';
	};

	return (
		<div className={props.visibleState}>
			<div className={styles.libPanelWrapper}>
				<label> &or; Basic</label>
			</div>
			<div className={styles.elementsContainer}>
				<div
					className={styles.elementSingle}
					onDragStart={(event) => onDragStart(event, 'expressionNode')}
					draggable
				>
					<label>Expr</label>
				</div>
				<div
					className={styles.elementSingle}
					onDragStart={(event) => onDragStart(event, 'ifNode')}
					draggable
				>
					<span>If</span>
				</div>
				<div
					className={styles.elementSingle}
					onDragStart={(event) => onDragStart(event, 'expressionNode')}
					draggable
				>
					<span>Simplify</span>
				</div>
				<div
					className={styles.elementSingle}
					onDragStart={(event) => onDragStart(event, 'expressionNode')}
					draggable
				>
					<span>csv</span>
				</div>
			</div>
			<div className={styles.libPanelWrapper}>
				<label> {'>'} Symbolic</label>
			</div>
		</div>
	);
}
