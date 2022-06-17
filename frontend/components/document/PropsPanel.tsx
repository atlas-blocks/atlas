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
	const [sourceSelect, setSourceSelect] = useState<string>('');
	const [selectedContent, setSelectedContent] = useState<string>('');

	const updContVal = (evt: ChangeEvent<HTMLTextAreaElement>) => {
		setNewContentValue(evt.target.value);
		// setSourceSelect(evt.target.value);
	};
	const updNameVal = (evt: ChangeEvent<HTMLInputElement>) => {
		setNewNameValue(evt.target.value);
	};

	const submitChanges = async () => {
		const sourceNodeForSelect: AtlasNode = wiu.graph.nodes.filter(
			(item) => item.name === newContentValue,
		)[0];

		if (wiu.selectedNode instanceof ContentNode) {
			if (
				wiu.selectedNode instanceof SelectNode &&
				sourceNodeForSelect instanceof ExpressionNode
			) {
				// wiu.selectedNode.content = `JSON3.write(repr.(${newContentValue}))`;

				wiu.graph.nodes.map((node) => {
					if (node instanceof SelectNode && node.name === wiu.selectedNode?.name) {
						node.content = `JSON3.write(repr.(${newContentValue}))`;
					}
				});

				await wiu.updateGraph();

				wiu.graph.nodes.map((node) => {
					if (node instanceof SelectNode && node.name === wiu.selectedNode?.name) {
						console.log(node.result);
						node.options = JSON.parse(node.result);
						node.selectedOption = 0;
						node.content = `${newContentValue}[1]`;
					}
				});

				wiu.selectedNode.name = newNameValue;
				await wiu.updateGraph();
				wiu.setSelectedNode(null);
				return;
			}

			wiu.selectedNode.content = newContentValue;
			wiu.selectedNode.name = newNameValue;
			await wiu.updateGraph();

			wiu.setSelectedNode(null);
		}
	};

	// console.log(wiu.selectedNode);

	function chooseProperties(): JSX.Element {
		// console.log(wiu.selectedNode)

		if (wiu.selectedNode instanceof MatrixFilterNode) {
			return <MatrixFilterBuilder setNewContentValue={setNewContentValue} />;
		} else if (wiu.selectedNode instanceof SelectNode) {
			return (
				<div>
					{/*<label>Source: </label>*/}
					{/*<input*/}
					{/*	className={styles.inputSourceSelect}*/}
					{/*	type={'text'}*/}
					{/*	// value={sourceSelect}*/}
					{/*	// onChange={(event) => setSourceSelect(event.target.value)}*/}
					{/*/>*/}
					{/*<button className={styles.btnUpload} onClick={uploadSelectOptions}>*/}
					{/*	upload options*/}
					{/*</button>*/}
				</div>
			);
		} else {
			return <></>;
		}
	}

	const uploadSelectOptions = async () => {
		let selNodeName = wiu.selectedNode?.name;

		const sourceNodeForSelect: AtlasNode = wiu.graph.nodes.filter(
			(item) => item.name === sourceSelect,
		)[0];
		if (
			wiu.selectedNode instanceof SelectNode &&
			sourceNodeForSelect instanceof ExpressionNode
		) {
			wiu.selectedNode.content = `JSON3.write(repr.(${sourceSelect}))`;
			await wiu.updateGraph();

			wiu.graph.nodes.map((node) => {
				if (node instanceof SelectNode && node.name === wiu.selectedNode?.name) {
					node.options = JSON.parse(node.result);
					node.content = `${sourceSelect}[1]`;
				}
			});
		}
	};

	// if (
	// 	wiu.selectedNode instanceof SelectNode
	// 	// sourceNodeForSelect instanceof ExpressionNode
	// ) {
	// 	wiu.setSelectedNode(wiu.selectedNode);
	// 	console.log(wiu.selectedNode.result, wiu.selectedNode.options);
	// }

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

	const selNodeSelOption =
		wiu.selectedNode instanceof SelectNode ? wiu.selectedNode.selectedOption : null;

	const extractVectorNameAndIndex = /(.*)(\[[^\]]+\]$)/;

	useEffect(() => {
		console.log('trig PP');
		if (wiu.selectedNode === null) return;

		setNewNameValue(wiu.selectedNode.name);
		if (wiu.selectedNode instanceof SelectNode) {
			const newCnt = wiu.selectedNode.content.match(extractVectorNameAndIndex);
			console.log('--', newCnt);
			setNewContentValue(newCnt ? newCnt[1] : '');
			return;
		}

		if (wiu.selectedNode instanceof ContentNode) {
			setNewContentValue(wiu.selectedNode.content);
		}
	}, [wiu.selectedNode]);

	// useEffect(() => {
	// 	if (wiu.selectedNode instanceof SelectNode) {
	// 		setNewContentValue(
	// 			sourceSelect
	// 				? sourceSelect + '[' + (wiu.selectedNode.selectedOption + 1).toString() + ']'
	// 				: '',
	// 		);
	// 	}
	// }, [wiu.selectedNode instanceof SelectNode ? wiu.selectedNode.selectedOption : null]);

	// console.log('newcont', newContentValue);

	// useEffect(() => {
	// 	console.log('render');
	// 	wiu.graph.nodes.map((node) => {
	// 		if (
	// 			node instanceof SelectNode &&
	// 			node.name === wiu.selectedNode?.name &&
	// 			sourceSelect
	// 		) {
	// 			setNewContentValue(sourceSelect + '[' + (node.selectedOption + 1).toString() + ']');
	// 			node.content = sourceSelect + '[' + (node.selectedOption + 1).toString() + ']';
	// 			// console.log(node.selectedOption)
	// 		}
	// 	});
	// }, [sourceSelect]);

	// console.log('render')

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
