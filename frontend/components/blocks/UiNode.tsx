import React, { useState } from 'react';
import { Handle, Position } from 'react-flow-renderer';
import styles from '../../styles/Block.module.css';
import AtlasNode from '../../src/graph/nodes/AtlasNode';
import ExpressionNode from '../../src/graph/nodes/ExpressionNode';
import TextNode from '../../src/graph/nodes/TextNode';
import FileNode from '../../src/graph/nodes/FileNode';
import SelectionNode from '../../src/graph/nodes/SelectionNode';
import MatrixFilterNode from '../../src/graph/nodes/MatrixFilterNode';
import ObjectNode from '../../src/graph/nodes/ObjectNode';
import FileUtils from '../../src/utils/FileUtils';
import { atlasModule } from '../../src/utils/AtlasModule';

export const uiNodeTypes = {
	[ExpressionNode.ui_type]: ExpressionBlock,
	[TextNode.ui_type]: TextBlock,
	[FileNode.ui_type]: FileBlock,
	[SelectionNode.ui_type]: SelectionBlock,
	[MatrixFilterNode.ui_type]: ExpressionBlock,
	[ObjectNode.ui_type]: ObjectBlock,
};

function blockWrapper(node: AtlasNode, tail?: JSX.Element | string): JSX.Element {
	return (
		<div className={styles.block}>
			<Handle type="target" position={Position.Top} />
			<Handle type="source" position={Position.Bottom} id="a" />
			<div className={styles.name}>{node.name}</div>
			{tail}
		</div>
	);
}

function contentWrapper(content: JSX.Element | string): JSX.Element {
	return <div className={styles.contentWrapper}>{content}</div>;
}

function resultWrapper(result: JSX.Element | string): JSX.Element {
	return <div className={styles.result}>{result}</div>;
}

function errorWrapper(error: JSX.Element | string): JSX.Element {
	return <div className={error !== 'nothing' ? styles.error : styles.invisible}>{error}</div>;
}

function TextBlock({ data }: { data: { node: TextNode } }) {
	return blockWrapper(data.node, contentWrapper(data.node.content));
}

// UI Blocks
function FileBlock({ data }: { data: { node: FileNode } }) {
	const [showContent, setShowContent] = useState<boolean>(false);

	const uploadFile = (event: React.ChangeEvent<HTMLInputElement>) => {
		if (event.target.files === null) return;
		FileUtils.getFileContentString(event.target.files[0], (content: string) =>
			data.node.setContent(content),
		);
		data.node.setUiFilename(event.target.files[0].name);
	};

	const showFileContent = (event: React.ChangeEvent<HTMLInputElement>) => {
		event.target.checked ? setShowContent(true) : setShowContent(false);
	};

	return blockWrapper(
		data.node,
		<>
			{contentWrapper(
				<>
					<input className={styles.inputFile} type="file" onChange={uploadFile} />
					<div className={styles.thickLine}>Imported file: {data.node.ui_filename}</div>
					<label>
						<input
							className={styles.inputFile}
							type="checkbox"
							onChange={showFileContent}
						/>
						Show content
					</label>
				</>,
			)}
			<div className={showContent === false ? styles.invisible : ''}>
				{resultWrapper(data.node.content)}
			</div>
		</>,
	);
}

function ExpressionBlock({ data }: { data: { node: ExpressionNode } }) {
	return blockWrapper(
		data.node,
		<>
			{contentWrapper(data.node.content)}
			{resultWrapper(data.node.result)}
			{errorWrapper(data.node.error)}
		</>,
	);
}

function SelectionBlock({ data: { node } }: { data: { node: SelectionNode } }) {
	const [selectedOption, setSelectedOption] = useState<number>(node.selectedOption);

	const handleSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
		setSelectedOption(parseInt(event.target.value));
		node.setSelectedOption(parseInt(event.target.value));
		atlasModule.updateGraph();
	};

	const getOption = (option: string, index: number): JSX.Element => {
		return (
			<option key={index} value={index}>
				{option}
			</option>
		);
	};

	const getSelectionContent = (options: string[]): JSX.Element => {
		return (
			<select className={styles.selectBlock} value={selectedOption} onChange={handleSelect}>
				{options.map((option: string, index: number) => getOption(option, index + 1))}
			</select>
		);
	};

	return blockWrapper(
		node,
		<>
			{contentWrapper(getSelectionContent(node.getOptions()))}
			{errorWrapper(node.error)}
		</>,
	);
}

function ObjectBlock({ data }: { data: { node: ObjectNode } }) {
	return blockWrapper(
		data.node,
		<>
			{contentWrapper(data.node.content)}
			{resultWrapper(data.node.ui_result)}
			{errorWrapper(data.node.error)}
		</>,
	);
}
