import React, { useState } from 'react';
import styles from '../../styles/main.module.css';
import DesmosTab from './tabs/DesmosTab';
import AtlasGraphTab from './tabs/AtlasGraphTab';

export default function TabsSection(): JSX.Element {
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
		return isActive ? styles.tabsSection : styles.panelHidden;
	};

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
				<AtlasGraphTab />
			</div>
			<div className={getFieldVisibility(isGraphicsFieldActive)}>
				<DesmosTab />
			</div>
		</>
	);
}
