import styles from '../../styles/PropsPanel.module.css';
import React, { ChangeEvent, useEffect, useState } from 'react';
import {
	AtlasNode,
	ContentNode,
	ExpressionNode,
	FileNode,
	MatrixFilterNode,
	SelectNode,
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

	const updContVal = (evt: ChangeEvent<HTMLTextAreaElement>) => {
		setNewContentValue(evt.target.value);
	};
	const updNameVal = (evt: ChangeEvent<HTMLInputElement>) => {
		setNewNameValue(evt.target.value);
	};

	const updateSelectionNodeData = (
		nodeName: string,
		content?: string,
		updateOptions?: boolean,
	) => {
		wiu.graph.nodes.map((node: AtlasNode) => {
			if (node instanceof SelectNode && node.name === nodeName) {
				if (content) node.content = content;
				if (updateOptions) {
					try {
						if (!Array.isArray(JSON.parse(JSON.parse(node.result))))
							throw 'Not a vector!';
						node.options = JSON.parse(JSON.parse(node.result));
						node.selectedOption = 0;
					} catch (e) {
						window.alert(`This JSON is not an array of options: ${e}`);
					}
				}
			}
		});
	};

	const submitChanges = async () => {
		wiu.selectedNode instanceof ExpressionNode ? console.log(wiu.selectedNode.result) : '';

		if (wiu.selectedNode instanceof ContentNode) {
			if (wiu.selectedNode instanceof SelectNode) {
				// const sourceNodeForSelect: AtlasNode = wiu.graph.nodes.filter(
				// 	(node: AtlasNode) => node.name === newContentValue,
				// )[0];
				// if (!(sourceNodeForSelect instanceof ExpressionNode)) {
				// 	window.alert('This Node cannot be a source for SelectionNode');
				// 	return;
				// }

				updateSelectionNodeData(
					wiu.selectedNode?.name,
					`JSON3.write(repr.(${newContentValue}))`,
				);
				await wiu.updateGraph();
				updateSelectionNodeData(wiu.selectedNode?.name, `${newContentValue}[1]`, true);
			} else {
				wiu.selectedNode.content = newContentValue;
			}

			wiu.selectedNode.name = newNameValue;
			await wiu.updateGraph();
			wiu.setSelectedNode(null);
		}
	};

	useEffect(() => {
		if (wiu.selectedNode === null) return;

		if (wiu.selectedNode instanceof ContentNode) {
			if (wiu.selectedNode instanceof SelectNode) {
				const regexforVectorName = /(.*)(\[[^\]]+\]$)/;
				const extractVectorName = wiu.selectedNode.content.match(regexforVectorName);
				setNewContentValue(extractVectorName ? extractVectorName[1] : '');
			} else {
				setNewContentValue(wiu.selectedNode.content);
			}
		}

		setNewNameValue(wiu.selectedNode.name);
	}, [wiu.selectedNode]);

	function chooseProperties(): JSX.Element {
		if (wiu.selectedNode instanceof MatrixFilterNode) {
			return <MatrixFilterBuilder setNewContentValue={setNewContentValue} />;
		} else {
			return <></>;
		}
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
		</>
	);
}
