import React from 'react';
import styles from '../../styles/main.module.css';
import { useEffect, useState } from 'react';
import DesmosGraphic from './DesmosGraphic';
import DnDFlow from './DnDFlow';
import { wiu } from '../../utils/WebInterfaceUtils';
import { DesmosNode } from '../../utils/AtlasGraph';

export default function FieldControl(): JSX.Element {
	const [tabsNames, setTabsNames] = useState<string[]>(['AtlasFlow']);
	const [selectedTab, setSelectedTab] = useState<number>(0);

	const showField = (event: React.MouseEvent<HTMLDivElement>) => {
		setSelectedTab(parseInt(event.currentTarget.id));
	};

	const getTabStyle = (currentTab: number | null): string => {
		return currentTab === selectedTab
			? styles.fieldTab + ' ' + styles.fieldTabActive
			: styles.fieldTab;
	};

	const isDNDVisible = (isActive: boolean): string => {
		return isActive ? styles.centralField : styles.panelHidden;
	};

	useEffect(() => {
		const allDesmosNodeNames: string[] = ['AtlasFlow'];
		wiu.graph.nodes.forEach((node) => {
			if (node instanceof DesmosNode) allDesmosNodeNames.push(node.name);
		});

		setTabsNames(allDesmosNodeNames);
	}, [wiu.graph.nodes.length]);

	function getTab(tabName: string, index: number): JSX.Element {
		return (
			<div
				key={tabName}
				id={index.toString()}
				className={getTabStyle(index)}
				onClick={showField}
			>
				<label>{tabName}</label>
			</div>
		);
	}

	return (
		<>
			<div className={styles.tabsWrapper}>
				{tabsNames.map((tabName: string, index: number) => getTab(tabName, index))}
			</div>

			<div className={isDNDVisible(selectedTab === 0)}>
				<DnDFlow />
			</div>
			{tabsNames.length > 1 ? (
				<div className={isDNDVisible(selectedTab !== 0)}>
					<DesmosGraphic desmosNodeName={tabsNames[selectedTab]} />
				</div>
			) : (
				''
			)}
		</>
	);
}
