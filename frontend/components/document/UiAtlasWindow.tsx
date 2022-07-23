import React, { useState } from 'react';

import styles from '../../styles/main.module.css';
import UiJupyterFlow from './flows/UiJupyterFlow';
import UiAtlasGraphFlow from './flows/UiAtlasGraphFlow';
import UiDesmosFlow from './flows/UiDesmosFlow';

import AtlasGrpahFlow from '../../src/flows/AtlasGraphFlow';
import JupyterFlow from '../../src/flows/JupyterFlow';
import DesmosFlow from '../../src/flows/DesmosFlow';

import { awu } from '../../src/utils/AtlasWindowUtils';

const uiFlowTypes = {
	[AtlasGrpahFlow.name]: UiAtlasGraphFlow,
	[JupyterFlow.name]: UiJupyterFlow,
	[DesmosFlow.name]: UiDesmosFlow,
};

export default function AtlasWindow(): JSX.Element {
	[awu.selectedFlow, awu.setSelectedFlow] = useState<number>(0);

	const getTabClass = (isActive: boolean): string => {
		return styles.fieldTab + ' ' + (isActive ? styles.activeTab : '');
	};
	const getFlowClass = (isActive: boolean): string => {
		return isActive ? '' : styles.panelHidden;
	};

	const getTabBarJSX = (): JSX.Element => {
		return (
			<div className={styles.tabBar}>
				{awu.flows.map((flow, index) => (
					<div
						className={getTabClass(index === awu.selectedFlow)}
						onClick={() => awu.setSelectedFlow(index)}
						key={index}
					>
						<label>{flow.getName()}</label>
					</div>
				))}
			</div>
		);
	};

	const getFlowHolderJSX = (): JSX.Element => {
		return (
			<div className={styles.flow}>
				{awu.flows.map((flow, index) => (
					<div
						className={getFlowClass(index === awu.selectedFlow)}
						style={{ width: '100%', height: '100%' }}
						key={index}
					>
						{React.createElement(uiFlowTypes[flow.constructor.name], {
							flow,
						})}
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
