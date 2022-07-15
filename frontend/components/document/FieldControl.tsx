import React from 'react';
import styles from '../../styles/main.module.css';
import { useEffect, useState } from 'react';
import DesmosGraphic from './DesmosGraphic';
import DnDFlow from './DnDFlow';
import { wiu } from '../../utils/WebInterfaceUtils';
import { DesmosNode } from '../../utils/AtlasGraph';

export default function FieldControl(): JSX.Element {
	const [desmosNodeNames, setDesmosNodeNames] = useState<string[]>([]);
	const [selectedDesmosTab, setSelectedDesmosTab] = useState<number | null>(null);

	const showDNDField = () => {
		setSelectedDesmosTab(null);
	};

	const showGraphicsField = (event: React.MouseEvent<HTMLDivElement>) => {
		setSelectedDesmosTab(parseInt(event.currentTarget.id));
	};

	const getTabStyle = (currentTab: number | null): string => {
		return currentTab === selectedDesmosTab
			? styles.fieldTab + ' ' + styles.fieldTabActive
			: styles.fieldTab;
	};

	const isDNDVisible = (isActive: boolean): string => {
		return isActive ? styles.centralField : styles.panelHidden;
	};

	useEffect(() => {
		wiu.graph.nodes.forEach((node) => {
			if (node instanceof DesmosNode && !desmosNodeNames.includes(node.name)) {
				desmosNodeNames.push(node.name);
				setDesmosNodeNames(desmosNodeNames);
			}
		});

		setDesmosNodeNames(
			desmosNodeNames.filter((desmos: string, index: number) => {
				let desmosInGraph = false;
				wiu.graph.nodes.forEach((node) => {
					if (node.name === desmos) {
						desmosInGraph = true;
						return;
					}
				});
				return desmosInGraph;
			}),
		);
	}, [wiu.graph.nodes.length]);

	function desmosTabs(desmosName: string, index: number): JSX.Element {
		return (
			<div
				key={desmosName}
				id={index.toString()}
				className={getTabStyle(index)}
				onClick={showGraphicsField}
			>
				<label>{desmosName}</label>
			</div>
		);
	}

	return (
		<>
			<div className={styles.flowControlWrapper}>
				<div className={getTabStyle(null)} onClick={showDNDField}>
					<label>AtlasFlow</label>
				</div>
				{desmosNodeNames.map((desmos: string, index: number) => desmosTabs(desmos, index))}
			</div>

			<div className={isDNDVisible(selectedDesmosTab === null)}>
				<DnDFlow />
			</div>
			{desmosNodeNames.length ? (
				<div className={isDNDVisible(selectedDesmosTab !== null)}>
					<DesmosGraphic desmosNodeName={desmosNodeNames[selectedDesmosTab]} />
				</div>
			) : (
				''
			)}
		</>
	);
}
