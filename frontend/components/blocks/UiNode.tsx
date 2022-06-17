import React, { useEffect, useState } from 'react';
import { Handle, Position } from 'react-flow-renderer';
import styles from '../../styles/Block.module.css';
import {
	ExpressionNode,
	TextNode,
	FileNode,
	SelectNode,
	MatrixFilterNode,
} from '../../utils/AtlasGraph';
import FileUtils from '../../utils/FileUtils';

export const uiNodeTypes = {
	[ExpressionNode.uitype]: ExpressionBlock,
	[TextNode.uitype]: TextBlock,
	[FileNode.uitype]: FileBlock,
	[SelectNode.uitype]: SelectBlock,
	[MatrixFilterNode.uitype]: ExpressionBlock,
};

export function UiBlockWrapper(
	name: string,
	content: JSX.Element | string,
	result: string | null = null,
	error: string | null = null,
): JSX.Element {
	return (
		<div className={styles.block}>
			<Handle type="target" position={Position.Left} />
			<Handle type="source" position={Position.Right} id="a" />
			<div className={styles.name}>{name}</div>
			<div className={styles.contentWrapper}>{content}</div>
			<div className={result !== null ? styles.result : ''}>{result}</div>
			<div
				className={error !== null && error !== 'nothing' ? styles.error : styles.invisible}
			>
				{error}
			</div>
		</div>
	);
}

export function TextBlock({ data }: { data: { node: TextNode } }) {
	return UiBlockWrapper(data.node.name, data.node.content);
}

export function FileBlock({ data }: { data: { node: FileNode } }) {
	const [contentToShow, setContentToShow] = useState<string | null>(null);

	const uploadFile = (event: React.ChangeEvent<HTMLInputElement>) => {
		if (event.target.files === null) return;
		FileUtils.getFileContentString(
			event.target.files[0],
			(content: string) => (data.node.content = content),
		);
		data.node.setFilename(event.target.files[0].name);
	};

	const showFileContent = (event: React.ChangeEvent<HTMLInputElement>) => {
		event.target.checked ? setContentToShow(data.node.content) : setContentToShow(null);
	};

	return UiBlockWrapper(
		data.node.name,
		<>
			<input className={styles.inputFile} type="file" onChange={uploadFile} />
			<div className={styles.thickLine}>Imported file: {data.node.filename}</div>
			<label>
				<input className={styles.inputFile} type="checkbox" onChange={showFileContent} />{' '}
				Show content
			</label>
		</>,
		contentToShow,
	);
}

export function ExpressionBlock({ data }: { data: { node: ExpressionNode } }) {
	return UiBlockWrapper(data.node.name, data.node.content, data.node.result, data.node.error);
}

export function SelectBlock({ data }: { data: { node: SelectNode } }) {
	const [options, setOptions] = useState<string[] | null>(null);
	const [selectedOption, setSelectedOption] = useState<number>(data.node.selectedOption);

	const handleSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
		setSelectedOption(parseInt(event.target.value));
	};

	useEffect(() => {
		data.node.selectedOption = selectedOption;
	}, [selectedOption]);

	useEffect(() => {
		if (data.node.options !== null) {
			setOptions(data.node.options);
			setSelectedOption(0);
		}
	}, [data.node.options]);

	function getOption(option: string, index: number): JSX.Element {
		return (
			<option key={index} value={index}>
				{option}
			</option>
		);
	}

	return UiBlockWrapper(
		data.node.name,
		<div>
			<div>
				<select
					className={styles.selectBlock}
					value={selectedOption}
					onChange={handleSelect}
				>
					{options
						? options.map((option: string, index: number) => getOption(option, index))
						: ''}
				</select>
			</div>
		</div>,
	);
}
