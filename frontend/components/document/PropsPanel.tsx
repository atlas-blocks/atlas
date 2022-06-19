import styles from '../../styles/PropsPanel.module.css';
import React, { ChangeEvent, useEffect, useState } from 'react';
import {
	AtlasNode,
	ContentNode,
	ExpressionNode,
	FileNode,
	MatrixFilterNode,
	SelectionNode,
	TextNode,
} from '../../utils/AtlasGraph';
import WebInterfaceUtils from '../../utils/WebInterfaceUtils';
import MatrixFilterBuilder from './MatrixFilterBuilder';

type Props = {
	wiu: WebInterfaceUtils;
};

export default function PropsPanel({ wiu }: Props): JSX.Element {
	const [newContentValue, setNewContentValue] = useState<string>('');
	const [newNameValue, setNewNameValue] = useState<string>('');
	const [nodeSource, setNodeSource] = useState<string>('');

	const updateContVal = (evt: ChangeEvent<HTMLTextAreaElement>) => {
		setNewContentValue(evt.target.value);
	};
	const updateNameVal = (evt: ChangeEvent<HTMLInputElement>) => {
		setNewNameValue(evt.target.value);
	};
	const updateNodeSource = (evt: ChangeEvent<HTMLInputElement>) => {
		setNodeSource(evt.target.value);
	};

	const submitChanges = async () => {
		if (wiu.selectedNode instanceof ContentNode) {
			wiu.selectedNode.setName(newNameValue);
			wiu.selectedNode.setContent(newContentValue);
		}
		if (wiu.selectedNode instanceof SelectionNode) {
			wiu.selectedNode.setSource(nodeSource);
		}
		await wiu.updateGraph();
		wiu.setSelectedNode(null);
	};

	useEffect(() => {
		if (wiu.selectedNode === null) return;

		setNewNameValue(wiu.selectedNode.name);
		if (wiu.selectedNode instanceof ContentNode) {
			setNewContentValue(wiu.selectedNode.content);
		}
		if (wiu.selectedNode instanceof SelectionNode) {
			setNodeSource(wiu.selectedNode.source);
		}
	}, [wiu.selectedNode]);

	function chooseProperties(): JSX.Element {
		if (wiu.selectedNode instanceof MatrixFilterNode) {
			return <MatrixFilterBuilder setNewContentValue={setNewContentValue} />;
		}
		if (wiu.selectedNode instanceof SelectionNode) {
			return (
				<div className={styles.propsPanelWrapper}>
					<label>Source</label>
					<input value={nodeSource} onChange={updateNodeSource} />
				</div>
			);
		}
		return <></>;
	}

	const typeDescriptions = {
		[MatrixFilterNode.uitype]:
			'Matrix Filter' +
			'\n\nYou can choose Matrix and add a special filter to any Columns and/or Rows with the logic Operator and Value:' +
			'\n\nmatrix: A\ncol: 1, opr: <, val: 4' +
			'\n-- provides all rows of matrix A with values less than 4 in Column 1' +
			'\nrow: 2, opr: >, val: 0' +
			'\n-- provides all columns of matrix A with values more than 0 in Row 2',
		[ExpressionNode.uitype]:
			'Expression' +
			'\n\nYou can use any expression or formula that Julia language supports.' +
			'\n\nSee more information on expressions in Julia Docs: https://docs.julialang.org\n/en/v1/base/math/',
		[TextNode.uitype]: 'Text' + '\n\nLoad any text, like CSV',
		[FileNode.uitype]: 'File' + '\n\nUpload a file',
	};

	const propsDescription = (): string => {
		const node = wiu.selectedNode;
		if (node === null || typeof typeDescriptions[node.uitype] === undefined) return '';

		return typeDescriptions[node.uitype];
	};

	return (
		<>
			<div className={styles.propsPanelWrapper}>
				<label>Name</label>
				<input value={newNameValue} onChange={updateNameVal} />
			</div>
			<div className={styles.propsPanelWrapper}>
				<label>Content</label>
				<textarea value={newContentValue} onChange={updateContVal} />
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
		</>
	);
}
