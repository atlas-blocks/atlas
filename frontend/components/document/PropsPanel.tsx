import styles from '../../styles/PropsPanel.module.css';
import React, { useEffect, useState } from 'react';
import { wiu } from '../../utils/WebInterfaceUtils';
import { typeDescriptions } from './descriptions';
import { InputState, NodeInput, getInputField, getTextareaField } from './propsInputFields';
import {
	AtlasNode,
	ExpressionNode,
	FileNode,
	SelectionNode,
	TextNode,
} from '../../utils/AtlasGraph';

export default function PropsPanel(): JSX.Element {
	const inputStates = {
		name: new InputState('name', useState<string>('')),
		content: new InputState('content', useState<string>('')),
		source: new InputState('source', useState<string>('')),
	};

	const nodeInputs = {
		[ExpressionNode.uitype]: [
			new NodeInput(inputStates.name, getInputField),
			new NodeInput(inputStates.content, getTextareaField),
		],
		[FileNode.uitype]: [
			new NodeInput(inputStates.name, getInputField),
			new NodeInput(inputStates.content, getTextareaField),
		],
		[TextNode.uitype]: [
			new NodeInput(inputStates.name, getInputField),
			new NodeInput(inputStates.content, getTextareaField),
		],
		[SelectionNode.uitype]: [
			new NodeInput(inputStates.name, getInputField),
			new NodeInput(inputStates.content, (inputState) => getInputField(inputState, true)),
			new NodeInput(inputStates.source, getInputField),
		],
	};

	const getNodeInputFields = (uitype: string): JSX.Element[] => {
		return nodeInputs[uitype].map((nodeInput) =>
			nodeInput.jsxElementGetter(nodeInput.inputState),
		);
	};

	const submitChanges = async () => {
		if (wiu.selectedNode === null) return;
		for (const nodeInput of nodeInputs[wiu.selectedNode.uitype]) {
			const inputState = nodeInput.inputState;
			const setter = inputState.getNameSetter() as keyof AtlasNode;
			(wiu.selectedNode[setter] as any)(inputState.state);
		}
		await wiu.updateGraph();
		wiu.setSelectedNode(null);
	};

	useEffect(() => {
		if (wiu.selectedNode === null) return;
		for (const nodeInput of nodeInputs[wiu.selectedNode.uitype]) {
			const inputState = nodeInput.inputState;
			const field: any = wiu.selectedNode[inputState.name as keyof AtlasNode];
			inputState.setState(field);
		}
	}, [wiu.selectedNode]);

	return (
		<>
			{wiu.selectedNode !== null ? getNodeInputFields(wiu.selectedNode.uitype) : ''}
			<div className={styles.propsPanelWrapper}>
				<button className={styles.btnSubmit} onClick={submitChanges}>
					Submit
				</button>
			</div>
			<div className={styles.propsPanelWrapper}>
				<label>Description</label>
				<p>{wiu.selectedNode !== null ? typeDescriptions[wiu.selectedNode.uitype] : ''}</p>
			</div>
		</>
	);
}
