import React, { useState } from 'react';
import { Handle, Position } from 'react-flow-renderer';
import styles from '../../styles/Block.module.css';
import {
	AtlasNode,
	ExpressionNode,
	TextNode,
	FileNode,
	SelectionNode,
	MatrixFilterNode,
	ObjectNode,
	DesmosNode,
} from '../../utils/AtlasGraph';
import FileUtils from '../../utils/FileUtils';
import { wiu } from '../../utils/WebInterfaceUtils';

export const uiNodeTypes = {
	[ExpressionNode.uitype]: ExpressionBlock,
	[TextNode.uitype]: TextBlock,
	[FileNode.uitype]: FileBlock,
	[SelectionNode.uitype]: SelectionBlock,
	[MatrixFilterNode.uitype]: ExpressionBlock,
	[ObjectNode.uitype]: ObjectBlock,
	[DesmosNode.uitype]: TextBlock,
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
		data.node.setFilename(event.target.files[0].name);
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
					<div className={styles.thickLine}>Imported file: {data.node.filename}</div>
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
		wiu.updateGraph();
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
			{resultWrapper(data.node.result)}
			{errorWrapper(data.node.error)}
		</>,
	);
}
