import styles from '../../styles/PropsPanel.module.css';
import React, { useEffect, useState } from 'react';
import { wiu } from '../../utils/WebInterfaceUtils';
import { typeDescriptions } from './props/descriptions';
import { InputState, NodeInput, getInputField, getTextareaField } from './props/propsInputFields';
import getMatrixBuilderField from './props/MatrixFilterBuilder';
import getObjectBuilder from './props/ObjectNodeBuilder';
import {
	AtlasNode,
	ExpressionNode,
	FileNode,
	SelectionNode,
	TextNode,
	MatrixFilterNode,
	ObjectNode,
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
		[MatrixFilterNode.uitype]: [
			new NodeInput(inputStates.name, getInputField),
			new NodeInput(inputStates.content, (inputState) => getTextareaField(inputState, true)),
			new NodeInput(inputStates.content, getMatrixBuilderField),
		],
		[SelectionNode.uitype]: [
			new NodeInput(inputStates.name, getInputField),
			new NodeInput(inputStates.content, (inputState) => getTextareaField(inputState, true)),
			new NodeInput(inputStates.source, getInputField),
		],
		[ObjectNode.uitype]: [
			new NodeInput(inputStates.name, getInputField),
			new NodeInput(inputStates.content, (inputState) => getTextareaField(inputState, true)),
			new NodeInput(inputStates.content, getObjectBuilder),
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
			// nodes classes must have setters for its fields in the format `setSomething`
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
