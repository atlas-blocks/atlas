import React, { useState } from 'react';
import styles from '../../styles/main.module.css';
import DesmosFlow from './flows/DesmosFlow';
import AtlasGraphFlow from './flows/AtlasGraphFlow';
import JupyterNotebookFlow from './flows/JupyterNotebookFlow';

export default function AtlasWindow(): JSX.Element {
	const [activeTab, setActiveTab] = useState<number>(0);

	const flows = [
		<AtlasGraphFlow data-name="atlas_graph" />, // eslint-disable-line react/jsx-key
		<JupyterNotebookFlow data-name="jupter_notebook" />, // eslint-disable-line react/jsx-key
		<DesmosFlow data-name="desmos" />, // eslint-disable-line react/jsx-key
	];

	const getTabClass = (isActive: boolean): string => {
		return styles.fieldTab + ' ' + (isActive ? styles.activeTab : '');
	};
	const getFlowClass = (isActive: boolean): string => {
		return isActive ? '' : styles.panelHidden;
	};

	const getTabBarJSX = (): JSX.Element => {
		return (
			<div className={styles.tabBar}>
				{flows.map((flow, index) => (
					<div
						className={getTabClass(index === activeTab)}
						onClick={(event) => setActiveTab(index)}
						key={index}
					>
						<label>{flow.props['data-name']}</label>
					</div>
				))}
			</div>
		);
	};

	const getFlowHolderJSX = (): JSX.Element => {
		return (
			<div className={styles.flow}>
				{flows.map((flow, index) => (
					<div
						className={getFlowClass(index === activeTab)}
						style={{ width: '100%', height: '100%' }}
						key={index}
					>
						{flow}
					</div>
				))}
			</div>
		);
	};

	return (
		<>
			{getTabBarJSX()}
			{getFlowHolderJSX()}
		</>
	);
}
