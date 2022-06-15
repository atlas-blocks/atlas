import React, { useState } from 'react';
import { Handle, Position } from 'react-flow-renderer';
import styles from '../../styles/Block.module.css';
import { ExpressionNode, TextNode, FileNode, SelectNode } from '../../utils/AtlasGraph';
import FileUtils from '../../utils/FileUtils';

export const uiNodeTypes = {
	[ExpressionNode.uitype]: ExpressionBlock,
	[TextNode.uitype]: TextBlock,
	[FileNode.uitype]: FileBlock,
	[SelectNode.uitype]: SelectBlock,
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
	const [selected, setSelected] = useState<number>(1);
	const [sourceSelect, setSourceSelect] = useState<string>('');

	const handleSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
		setSelected(parseInt(event.target.value));
	};

	function getOption(item: any, index: number): JSX.Element {
		return <option value={index}>[{item.toString()}]</option>;
	}

	data.node.content = `[JSON3.write(${sourceSelect}[${
		selected + 1
	}]), JSON3.write(${sourceSelect})]`;

	let parsedResult: [] | null = null;
	let parsedOptions: [] = [];
	if (data.node.result) {
		parsedResult = JSON.parse(data.node.result)[0];
		parsedOptions = JSON.parse(JSON.parse(data.node.result)[1]);
	}

	console.log(parsedOptions);

	return UiBlockWrapper(
		data.node.name,
		<>
			<div>
				<label>Source: </label>
				<input
					className={styles.inputSelectSource}
					type={'text'}
					value={sourceSelect}
					onChange={(event) => setSourceSelect(event.target.value)}
				/>
			</div>
			<div>
				<label>Select: </label>
				<select className={styles.selectBlock} value={selected} onChange={handleSelect}>
					{parsedOptions.map((item, index) => getOption(item, index))}
				</select>
			</div>
			<div>
				<label className={styles.thickLine}>
					Use index {data.node.name}[1] to access selected
				</label>
			</div>
		</>,
		parsedResult ? parsedResult.toString() : null,
	);
}
