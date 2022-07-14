import React from 'react';
import styles from '../../styles/main.module.css';
import { useEffect, useState } from 'react';
import DesmosGraphic from './DesmosGraphic';
import DnDFlow from './DnDFlow';
import { wiu } from '../../utils/WebInterfaceUtils';
import { DesmosNode } from '../../utils/AtlasGraph';

export default function FieldControl(): JSX.Element {
	const [isDNDFieldActive, setDNDFieldActive] = useState<boolean>(true);
	const [whichDesmosActive, setDesmosActive] = useState<boolean[]>([]);

	const hideAll = () => {
		setDNDFieldActive(false);
		whichDesmosActive.fill(false);
		setDesmosActive(whichDesmosActive);
	};
	const showDNDField = () => {
		hideAll();
		setDNDFieldActive(true);
	};
	const showGraphicsField = (event: React.MouseEvent<HTMLDivElement>) => {
		hideAll();
		setDesmosActive(
			whichDesmosActive.map((dState, index) => {
				return index === parseInt(event.currentTarget.id) ? !dState : dState;
			}),
		);
	};

	const getTabStyle = (isActive: boolean): string => {
		return styles.fieldTab + ' ' + (isActive ? styles.fieldTabActive : '');
	};
	const getFieldVisibility = (isActive: boolean): string => {
		return isActive ? styles.centralField : styles.panelHidden;
	};

	const [desmosArray, setDesmosArray] = useState<string[]>([]);

	useEffect(() => {
		wiu.graph.nodes.forEach((node) => {
			if (node instanceof DesmosNode && !desmosArray.includes(node.name)) {
				desmosArray.push(node.name);
				whichDesmosActive.push(false);
				setDesmosArray(desmosArray);
				setDesmosActive(whichDesmosActive);
			}
		});

		setDesmosArray(
			desmosArray.filter((desmos: string, index: number) => {
				let desmosInGraph = false;
				wiu.graph.nodes.forEach((node) => {
					if (node.name === desmos) {
						desmosInGraph = true;
						return;
					}
				});
				if (!desmosInGraph) {
					whichDesmosActive.splice(index, 1);
					setDesmosActive(whichDesmosActive);
				}
				return desmosInGraph;
			}),
		);
	}, [wiu.graph.nodes.length]);

	function desmosTabs(desmos: string, index: number): JSX.Element {
		return (
			<div
				id={index.toString()}
				className={getTabStyle(whichDesmosActive[index])}
				onClick={showGraphicsField}
			>
				<label>{desmos}</label>
			</div>
		);
	}

	function desmosGraphics(desmos: string, index: number): JSX.Element {
		return (
			<div id={index.toString()} className={getFieldVisibility(whichDesmosActive[index])}>
				<DesmosGraphic desmosName={desmos} />
			</div>
		);
	}

	return (
		<>
			<div className={styles.flowControlWrapper}>
				<div className={getTabStyle(isDNDFieldActive)} onClick={showDNDField}>
					<label>AtlasFlow</label>
				</div>
				{desmosArray.map((desmos: string, index: number) => desmosTabs(desmos, index))}
			</div>
			<div className={getFieldVisibility(isDNDFieldActive)}>
				<DnDFlow />
			</div>
			{desmosArray.map((desmos: string, index: number) => desmosGraphics(desmos, index))}
			{/*<div className={getFieldVisibility(isGraphicsFieldActive)}>*/}
			{/*	<DesmosGraphic />*/}
			{/*</div>*/}
		</>
	);
}
