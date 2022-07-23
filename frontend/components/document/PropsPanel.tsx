import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

import styles from '../../styles/PropsPanel.module.css';
import { wiu } from '../../src/utils/WebInterfaceUtils';
import { atlasModule } from '../../src/utils/AtlasModule';
import { InputState, NodeInput, getInputField, getTextareaField } from './props/propsInputFields';
import getMatrixBuilderField from './props/MatrixFilterBuilder';
import AtlasNode from '../../src/graph/nodes/AtlasNode';
import ExpressionNode from '../../src/graph/nodes/ExpressionNode';
import FileNode from '../../src/graph/nodes/FileNode';
import TextNode from '../../src/graph/nodes/TextNode';
import SelectionNode from '../../src/graph/nodes/SelectionNode';
import MatrixFilterNode from '../../src/graph/nodes/MatrixFilterNode';
import ObjectNode from '../../src/graph/nodes/ObjectNode';
import getObjectBuilder from './props/ObjectNodeBuilder';
import DesmosNode from '../../src/graph/nodes/DesmosNode';

import { nodeDescriptions as nodeDescriptions_en } from '../../locales/en';
import { nodeDescriptions as nodeDescriptions_ru } from '../../locales/ru';

export default function PropsPanel(): JSX.Element {
	const router = useRouter();
	const { locale } = router;
	const nodeDescriptions = locale === 'en' ? nodeDescriptions_en : nodeDescriptions_ru;

	const inputStates = {
		name: new InputState('name', useState<string>('')),
		content: new InputState('content', useState<string>('')),
		source: new InputState('source', useState<string>('')),
	};

	const nodeInputs = {
		[ExpressionNode.ui_type]: [
			new NodeInput(inputStates.name, getInputField),
			new NodeInput(inputStates.content, getTextareaField),
		],
		[FileNode.ui_type]: [
			new NodeInput(inputStates.name, getInputField),
			new NodeInput(inputStates.content, getTextareaField),
		],
		[TextNode.ui_type]: [
			new NodeInput(inputStates.name, getInputField),
			new NodeInput(inputStates.content, getTextareaField),
		],
		[DesmosNode.ui_type]: [
			new NodeInput(inputStates.name, getInputField),
			new NodeInput(inputStates.content, getTextareaField),
		],
		[MatrixFilterNode.ui_type]: [
			new NodeInput(inputStates.name, getInputField),
			new NodeInput(inputStates.content, (inputState) => getTextareaField(inputState, true)),
			new NodeInput(inputStates.content, getMatrixBuilderField),
		],
		[SelectionNode.ui_type]: [
			new NodeInput(inputStates.name, getInputField),
			new NodeInput(inputStates.content, (inputState) => getTextareaField(inputState, true)),
			new NodeInput(inputStates.source, getInputField),
		],
		[ObjectNode.ui_type]: [
			new NodeInput(inputStates.name, getInputField),
			new NodeInput(inputStates.content, (inputState) => getTextareaField(inputState, true)),
			new NodeInput(inputStates.content, getObjectBuilder),
		],
	};

	const getNodeInputFields = (ui_type: string): JSX.Element[] => {
		return nodeInputs[ui_type].map((nodeInput) =>
			nodeInput.jsxElementGetter(nodeInput.inputState),
		);
	};

	const submitChanges = async () => {
		if (!wiu.selectedNode) return;
		for (const nodeInput of nodeInputs[wiu.selectedNode.ui_type]) {
			const inputState = nodeInput.inputState;
			const setter = inputState.getNameSetter() as keyof AtlasNode;
			// nodes classes must have setters for its fields in the format `setSomething`
			(wiu.selectedNode[setter] as any)(inputState.state);
		}
		await atlasModule.updateGraph();
		wiu.setSelectedNode(null);
	};

	useEffect(() => {
		if (!wiu.selectedNode) return;
		for (const nodeInput of nodeInputs[wiu.selectedNode.ui_type]) {
			const inputState = nodeInput.inputState;
			const field: any = wiu.selectedNode[inputState.name as keyof AtlasNode];
			inputState.setState(field);
		}
	}, [wiu.selectedNode]);

	return (
		<>
			{wiu.selectedNode ? getNodeInputFields(wiu.selectedNode.ui_type) : ''}
			<div className={styles.propsPanelWrapper}>
				<button className={styles.btnSubmit} onClick={submitChanges}>
					Submit
				</button>
			</div>
			<div className={styles.propsPanelWrapper}>
				<label>Description</label>
				<p>{wiu.selectedNode ? nodeDescriptions[wiu.selectedNode.ui_type] : ''}</p>
			</div>
		</>
	);
}
