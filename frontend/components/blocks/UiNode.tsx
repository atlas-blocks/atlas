import React, { useEffect, useState } from 'react';
import { Handle, Position } from 'react-flow-renderer';
import styles from '../../styles/Block.module.css';
import {
	AtlasNode,
	ContentNode,
	ExpressionNode,
	TextNode,
	FileNode,
	SelectionNode,
	MatrixFilterNode,
} from '../../utils/AtlasGraph';
import FileUtils from '../../utils/FileUtils';
import { wiu } from '../../utils/WebInterfaceUtils';

export const uiNodeTypes = {
	[ExpressionNode.uitype]: ExpressionBlock,
	[TextNode.uitype]: TextBlock,
	[FileNode.uitype]: FileBlock,
	[SelectionNode.uitype]: SelectionBlock,
	[MatrixFilterNode.uitype]: ExpressionBlock,
};

function UiBlockWrapper(node: AtlasNode, tail?: JSX.Element | string): JSX.Element {
	return (
		<div className={styles.block}>
			<Handle type="target" position={Position.Left} />
			<Handle type="source" position={Position.Right} id="a" />
			<div className={styles.name}>{node.name}</div>
			{tail}
		</div>
	);
}

function ContentUiBlockWrapper(node: ContentNode, tail?: JSX.Element | string): JSX.Element {
	return UiBlockWrapper(
		node,
		<>
			<div className={styles.contentWrapper}>{node.content}</div>
			{tail}
		</>,
	);
}

function ExpressionUiBlockWrapper(node: ExpressionNode, tail?: JSX.Element | string): JSX.Element {
	return ContentUiBlockWrapper(
		node,
		<>
			<div className={styles.result}>{node.result}</div>
			<div className={node.error !== 'nothing' ? styles.error : styles.invisible}>
				{node.error}
			</div>
			{tail}
		</>,
	);
}

function TextBlock({ data }: { data: { node: TextNode } }) {
	return ContentUiBlockWrapper(data.node);
}

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

	return ContentUiBlockWrapper(
		data.node,
		<>
			<input className={styles.inputFile} type="file" onChange={uploadFile} />
			<div className={styles.thickLine}>Imported file: {data.node.filename}</div>
			<label>
				<input className={styles.inputFile} type="checkbox" onChange={showFileContent} />{' '}
				Show content
			</label>
			<div className={showContent === true ? styles.contentWrapper : styles.invisible}>
				{data.node.content}
			</div>
		</>,
	);
}

function ExpressionBlock({ data }: { data: { node: ExpressionNode } }) {
	return ExpressionUiBlockWrapper(data.node);
}

function SelectionBlock({ data }: { data: { node: SelectionNode } }) {
	const [selectedOption, setSelectedOption] = useState<number>(data.node.selectedOption);

	const handleSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
		setSelectedOption(parseInt(event.target.value));
		data.node.setSelectedOption(parseInt(event.target.value));
		wiu.updateGraph();
	};

	function getOption(option: string, index: number): JSX.Element {
		return (
			<option key={index} value={index}>
				{option}
			</option>
		);
	}

	return UiBlockWrapper(
		data.node,
		<div>
			<div>
				<select
					className={styles.selectBlock}
					value={selectedOption}
					onChange={handleSelect}
				>
					{data.node
						.getOptions()
						.map((option: string, index: number) => getOption(option, index + 1))}
				</select>
			</div>
		</div>,
	);
}
