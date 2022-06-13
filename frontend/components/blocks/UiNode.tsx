import React from 'react';
import { Handle, Position } from 'react-flow-renderer';
import styles from '../../styles/Block.module.css';
import { ExpressionNode, TextNode, FileNode } from '../../utils/AtlasGraph';
import FileUtils from '../../utils/FileUtils';

export const uiNodeTypes = {
	[ExpressionNode.type]: ExpressionBlock,
	[TextNode.type]: TextBlock,
	[FileNode.type]: FileBlock,
};

export function UiBlockWrapper(
	blockClass: string,
	name: string,
	content: JSX.Element,
	result: string | null = null,
) {
	function insertResult(): JSX.Element {
		if (!result) return <></>;
		return <div className={styles.nameAndResult}>{result}</div>;
	}

	return (
		<div className={`${styles.block} ${blockClass}`}>
			<Handle type="target" position={Position.Left} />
			<Handle type="source" position={Position.Right} id="a" />
			<div className={styles.name}>{name}</div>
			<div className={styles.contentWrapper}>{content}</div>
			{insertResult()}
		</div>
	);
}

export function TextBlock({ data }: { data: { node: TextNode } }) {
	return UiBlockWrapper(styles.text_block, data.node.name, <div>{data.node.content}</div>);
}

export function FileBlock({ data }: { data: { node: FileNode } }) {
	const uploadFile = (node: FileNode, filepath: File) => {
		FileUtils.getFileContentString(filepath, (content: string) => (node.content = content));
	};
	return UiBlockWrapper(
		styles.text_block,
		data.node.name,
		<div>
			<div>filename {data.node.filename}</div>
			<div>
				<input
					type="file"
					onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
						if (event.target.files === null) return;
						uploadFile(data.node, event.target.files[0]);
					}}
				/>
			</div>
		</div>,
	);
}

export function ExpressionBlock({ data }: { data: { node: ExpressionNode } }) {
	return UiBlockWrapper(
		styles.expression_block,
		data.node.name,
		<div>{data.node.content}</div>,
		data.node.result,
	);
}
