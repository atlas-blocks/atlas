import styles from '../../styles/PropsPanel.module.css';
import React, { ChangeEvent, useEffect, useState } from 'react';
import {
	ContentNode,
	ExpressionNode,
	FileNode,
	MatrixFilterNode,
	TextNode,
} from '../../utils/AtlasGraph';
import WebInterfaceUtils from '../../utils/WebInterfaceUtils';
import MatrixFilterBuilder from './MatrixFilterBuilder';

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
			webInterfaceUtils.selectedNode.name = newNameValue;
			await webInterfaceUtils.updateGraph();

			webInterfaceUtils.setSelectedNode(null);
		}
	};

	function chooseProperties(): JSX.Element {
		if (webInterfaceUtils.selectedNode instanceof MatrixFilterNode) {
			return <MatrixFilterBuilder setNewContentValue={setNewContentValue} />;
		} else {
			return <></>;
		}
	}

	const propsDescription = () => {
		if (webInterfaceUtils.selectedNode instanceof ExpressionNode) {
			return webInterfaceUtils.selectedNode instanceof MatrixFilterNode
				? 'Matrix Filter' +
						'\n\nYou can choose Matrix and add a special filter to any Columns and/or Rows with the logic Operator and Value:' +
						'\n\nmatrix: A\ncol: 1, opr: <, val: 4' +
						'\n-- provides all rows of matrix A with values less than 4 in Column 1' +
						'\nrow: 2, opr: >, val: 0' +
						'\n-- provides all columns of matrix A with values more than 0 in Row 2'
				: 'Expression' +
						'\n\nYou can use any expression or formula that Julia language supports.' +
						'\n\nSee more information on expressions in Julia Docs: https://docs.julialang.org\n/en/v1/base/math/';
		} else if (webInterfaceUtils.selectedNode instanceof TextNode) {
			return 'Text' + '\n\nLoad any text, like CSV';
		} else if (webInterfaceUtils.selectedNode instanceof FileNode) {
			return 'File' + '\n\nUpload a file';
		} else return '';
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
				<input value={newNameValue} onChange={updNameVal} />
			</div>
			<div className={styles.propsPanelWrapper}>
				<label>Content</label>
				<textarea value={newContentValue} onChange={updContVal} />
			</div>
			<div className={styles.propsPanelWrapper}>{chooseProperties()}</div>
			<div className={styles.propsPanelWrapper}>
				<button className={styles.btnSubmit} onClick={submitChanges}>
					Submit
				</button>
			</div>
			<div className={styles.propsPanelWrapper}>
				<label>Description</label>
				<p>{propsDescription()}</p>
				<p></p>
			</div>
		</div>
	);
}
