import React, { useState } from 'react';
import styles from '../../styles/main.module.css';
import DesmosTab from './tabs/DesmosTab';
import AtlasGraphTab from './tabs/AtlasGraphTab';
import JupyterNotebook from './JupyterNotebook';

export default function TabsSection(): JSX.Element {
	const [activeTab, setActiveTab] = useState<number>(0);

	// eslint-disable-next-line react/jsx-key
	const tabs: React.Component[] = [<AtlasGraphTab />, <DesmosTab />, <JupyterNotebook />];

	const getTabNavigationStyle = (isActive: boolean): string => {
		return styles.fieldTab + ' ' + (isActive ? styles.fieldTabActive : '');
	};
	const getTabFlowStyle = (isActive: boolean): string => {
		return isActive ? '' : styles.panelHidden;
	};

	const getTabsNavigationJSX = (): JSX.Element => {
		return (
			<div>
				<div className={styles.flowControlWrapper}>
					{tabs.map((tab, index) => (
						<div
							className={getTabNavigationStyle(index === activeTab)}
							onClick={(event) => setActiveTab(index)}
							key={index}
						>
							<label>tab{index}</label>
						</div>
					))}
				</div>
			</div>
		);
	};

	const getTabsFlowJSX = (): JSX.Element => {
		return (
			<div className={styles.flow}>
				{tabs.map((tab, index) => (
					<div
						className={getTabFlowStyle(index === activeTab)}
						style={{ width: '100%', height: '100%' }}
						key={index}
					>
						{tab}
					</div>
				))}
			</div>
		);
	};

	return (
		<>
			{getTabsNavigationJSX()}
			{getTabsFlowJSX()}
		</>
	);
}
