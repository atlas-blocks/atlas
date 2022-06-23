import styles from '../../styles/FlowControl.module.css';

export default function FlowControl(): JSX.Element {
	return (
		<div className={styles.flowControlWrapper}>
			<div className={styles.dndFlowTab}>
				<label>AtlasFlow</label>
			</div>
			<div className={styles.graphicsTab}>
				<label>Graphics</label>
			</div>
		</div>
	);
}
