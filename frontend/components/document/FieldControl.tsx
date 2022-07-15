import React from 'react';
import styles from '../../styles/main.module.css';
import { useEffect, useState } from 'react';
import DesmosGraphic from './DesmosGraphic';
import DnDFlow from './DnDFlow';
import { wiu } from '../../utils/WebInterfaceUtils';
import { DesmosNode } from '../../utils/AtlasGraph';

export default function FieldControl(): JSX.Element {
	const [tabsNames, setTabsNames] = useState<string[]>(['AtlasFlow']);
	const [selectedTab, setSelectedTab] = useState<string>('AtlasFlow');
	const [desmosExists, setDesmosExists] = useState<boolean>(false);

	const showField = (event: React.MouseEvent<HTMLDivElement>) => {
		setSelectedTab(event.currentTarget.id);
	};

	useEffect(() => {
		const allDesmosNames: string[] = [];
		wiu.graph.nodes.forEach((node) => {
			if (node instanceof DesmosNode) allDesmosNames.push(node.name);
		});
		setTabsNames(['AtlasFlow'].concat(allDesmosNames));
		setDesmosExists(!!allDesmosNames.length);
	}, [wiu.graph.nodes.length]);

	function getTab(tabName: string): JSX.Element {
		return (
			<div
				key={tabName}
				id={tabName}
				className={
					tabName === selectedTab
						? styles.fieldTab + ' ' + styles.fieldTabActive
						: styles.fieldTab
				}
				onClick={showField}
			>
				<label>{tabName}</label>
			</div>
		);
	}

	function getDesmos(): JSX.Element {
		if (!desmosExists) return <></>;
		return (
			<div className={selectedTab !== 'AtlasFlow' ? styles.centralField : styles.panelHidden}>
				<DesmosGraphic desmosNodeName={selectedTab} />
			</div>
		);
	}

	return (
		<>
			<div className={styles.tabsWrapper}>
				{tabsNames.map((tabName: string) => getTab(tabName))}
			</div>
			<div className={selectedTab === 'AtlasFlow' ? styles.centralField : styles.panelHidden}>
				<DnDFlow />
			</div>
			{getDesmos()}
		</>
	);
}
