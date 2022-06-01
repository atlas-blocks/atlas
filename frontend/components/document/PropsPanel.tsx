import styles from '../../styles/PropsPanel.module.css';
import React, { ChangeEvent, useEffect, useImperativeHandle, useState } from 'react';
import AtlasGraph, { AtlasNode, ContentNode } from '../../utils/AtlasGraph';
import WebInterfaceUtils from '../../utils/WebInterfaceUtils';

type Props = {
	propPanelStyleWrapper: string;
	webInterfaceUtils: WebInterfaceUtils;
};

export default function PropsPanel({
	propPanelStyleWrapper,
	webInterfaceUtils,
}: Props): JSX.Element {
	const [newContentValue, setNewContentValue] = useState<string>('');
	const [newNameValue, setNewNameValue] = useState<string>('');

	const updContVal = (evt: ChangeEvent<HTMLTextAreaElement>) => {
		setNewContentValue(evt.target.value);
	};
	const updNameVal = (evt: ChangeEvent<HTMLInputElement>) => {
		setNewNameValue(evt.target.value);
	};

	const submitChanges = async () => {
		if (webInterfaceUtils.selectedNode instanceof ContentNode) {
			webInterfaceUtils.selectedNode.content = newContentValue;
			// webInterfaceUtils.selectedNode.name = newNameValue
			// webInterfaceUtils.refreshUiElements()
			await webInterfaceUtils.updateGraph();

			webInterfaceUtils.setSelectedNode(null);
		}
	};

	useEffect(() => {
		if (webInterfaceUtils.selectedNode instanceof ContentNode) {
			setNewContentValue(webInterfaceUtils.selectedNode.content);
			setNewNameValue(webInterfaceUtils.selectedNode.name);
		}
	}, [webInterfaceUtils.selectedNode]);

	return (
		<div className={`${propPanelStyleWrapper}`}>
			<div className={styles.propsPanelWrapper}>
				<label>Name</label>
				<input className={styles.inpName} value={newNameValue} onChange={updNameVal} />
			</div>
			<div className={styles.propsPanelWrapper}>
				<label>Content</label>
				<textarea
					className={styles.inpContent}
					value={newContentValue}
					onChange={updContVal}
				/>
			</div>
			<div className={styles.propsPanelWrapper}>
				<button className={styles.btnSubmit} onClick={submitChanges}>
					Submit
				</button>
			</div>
		</div>
	);
}
