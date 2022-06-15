import React, { useRef, useState } from 'react';
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
	const srcSelect = useRef<any>();
	const [selected, setSelected] = useState<number>(1);

	const handleSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
		setSelected(parseInt(event.target.value));
	};

	function getOption(item: any, index: number): JSX.Element {
		if (index === 0 || index === data.node.result.split('%%%').length - 1) return <></>;
		return <option value={index}>{item}</option>;
	}

	data.node.content = `[${srcSelect?.current?.value}[${selected}], "%%%"*join(repr.(${srcSelect?.current?.value}), "%%%")*"%%%"]`;

	return UiBlockWrapper(
		data.node.name,
		<>
			<div>
				<label>Source: </label>
				<input className={styles.inputSelectSrc} type={'text'} ref={srcSelect} />
				<select className={styles.selectBlock} value={selected} onChange={handleSelect}>
					{data.node.result.split('%%%').map((item, index) => getOption(item, index))}
				</select>
			</div>
			<label className={styles.thickLine}>
				Use index {data.node.name}[1] to access selected
			</label>
		</>,
		data.node.result.split('%%%')[selected],
	);
}
