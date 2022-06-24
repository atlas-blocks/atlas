// import styles from '../../styles/FlowControl.module.css';
import styles from '../../styles/main.module.css';
import { useEffect, useState } from 'react';
import GraphicsField from './GraphicsField';
import DnDFlow from './DnDFlow';

export default function FieldControl(): JSX.Element {
	const [isDNDFieldActive, setDNDFieldActive] = useState<boolean>(true);
	const [isGraphicsFieldActive, setGraphicsFieldActive] = useState<boolean>(false);

	const hideAll = () => {
		setDNDFieldActive(false);
		setGraphicsFieldActive(false);
	};
	const showDNDField = () => {
		hideAll();
		setDNDFieldActive(true);
	};
	const showGraphicsField = () => {
		hideAll();
		setGraphicsFieldActive(true);
	};

	const getTabStyle = (isActive: boolean): string => {
		return styles.fieldTab + ' ' + (isActive ? styles.fieldTabActive : '');
	};
	const getFieldVisibility = (isActive: boolean): string => {
		return isActive ? styles.centralField : styles.panelHidden;
	};

	// useEffect(() => {
	// 	wiu.selectedNode ? showProperties() : showLibraries();
	// }, [wiu.selectedNode]);

	return (
		<>
			<div className={styles.flowControlWrapper}>
				<div className={getTabStyle(isDNDFieldActive)} onClick={showDNDField}>
					<label>AtlasFlow</label>
				</div>
				<div className={getTabStyle(isGraphicsFieldActive)} onClick={showGraphicsField}>
					<label>Graphics</label>
				</div>
			</div>
			<div className={getFieldVisibility(isDNDFieldActive)}>
				<DnDFlow />
			</div>
			<div className={getFieldVisibility(isGraphicsFieldActive)}>
				<GraphicsField />
			</div>
		</>
	);
}
