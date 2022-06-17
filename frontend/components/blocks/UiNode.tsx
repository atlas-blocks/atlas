import React, { useEffect, useRef, useState } from 'react';
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
import PropsPanel from '../document/PropsPanel';
import Home from '../../pages/document';

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
): JSX.Element {
	return (
		<div className={styles.block}>
			<Handle type="target" position={Position.Left} />
			<Handle type="source" position={Position.Right} id="a" />
			<div className={styles.name}>{name}</div>
			<div className={styles.contentWrapper}>{content}</div>
			<div className={result !== null ? styles.result : ''}>{result}</div>
		</div>
	);
}

export function TextBlock({ data }: { data: { node: TextNode } }) {
	return UiBlockWrapper(data.node.name, data.node.content);
}

export function FileBlock({ data }: { data: { node: FileNode } }) {
	const [contentToShow, setcontentToShow] = useState<string | null>(null);
	const [importedFileName, setImportedFileName] = useState<string>(data.node.filename);

	const uploadFile = (event: React.ChangeEvent<HTMLInputElement>) => {
		if (event.target.files === null) return;
		FileUtils.getFileContentString(
			event.target.files[0],
			(content: string) => (data.node.content = content),
		);
		setImportedFileName(event.target.files[0].name);
	};

	const showFileContent = (event: React.ChangeEvent<HTMLInputElement>) => {
		event.target.checked ? setcontentToShow(data.node.content) : setcontentToShow(null);
	};

	return UiBlockWrapper(
		data.node.name,
		<>
			<input className={styles.inputFile} type="file" onChange={uploadFile} />
			<div className={styles.thickLine}>Imported file: {importedFileName}</div>
			<label>
				<input className={styles.inputFile} type="checkbox" onChange={showFileContent} />{' '}
				Show content
			</label>
		</>,
		contentToShow,
	);
}

export function ExpressionBlock({ data }: { data: { node: ExpressionNode } }) {
	return UiBlockWrapper(data.node.name, data.node.content, data.node.result);
}

export function SelectBlock({ data }: { data: { node: SelectNode } }) {
	const [opt, setOpt] = useState<any>(null);
	const [selectedOption, setSelectedOption] = useState<number>(data.node.selectedOption);
	// const divRef = useRef<HTMLDivElement | null>(null);

	const handleSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
		setSelectedOption(parseInt(event.target.value));
		// data.node.selectedOption = selectedOption;
	};

	// console.log('selected', data.node.selectedOption);

	function getOption(option: string, index: number): JSX.Element {
		return (
			<option key={index} value={index}>
				{option}
			</option>
		);
	}

	useEffect(() => {
		data.node.selectedOption = selectedOption;
		// divRef.current?.click();
		// divRef.current?.click();
	}, [selectedOption]);

	// console.log('ui-render')

	// console.log(data.node.options, opt)

	useEffect(() => {
		if (data.node.options !== null) {
			setOpt(data.node.options);
			// data.node.selectedOption = 0;
			setSelectedOption(0);
		}
		console.log('new opt');
	}, [data.node.options]);

	return UiBlockWrapper(
		data.node.name,
		<div>
			<div>
				<select
					className={styles.selectBlock}
					value={selectedOption}
					onChange={handleSelect}
				>
					{opt
						? opt.map((option: string, index: number) => getOption(option, index))
						: ''}
				</select>
			</div>
		</div>,
	);
}
