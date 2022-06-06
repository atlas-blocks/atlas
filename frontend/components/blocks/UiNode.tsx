import React from 'react';
import { Handle, Position } from 'react-flow-renderer';
import styles from '../../styles/Block.module.css';
import { ExpressionNode, TextNode, FileNode } from '../../utils/AtlasGraph';

export const uiNodeTypes = {
	[ExpressionNode.type]: ExpressionBlock,
	[TextNode.type]: TextBlock,
	[FileNode.type]: FileBlock,
};

export function FormulaBlockWrapper(content: JSX.Element, blockClass: string) {
	return (
		<div className={`${styles.block} ${blockClass}`}>
			<Handle type="target" position={Position.Left} />
			<Handle type="source" position={Position.Right} id="a" />
			<div className={styles.display_linebreak}>{content}</div>
		</div>
	);
}

export function TextBlock({ data }: { data: { node: TextNode } }) {
	return FormulaBlockWrapper(
		<div className={`${styles.text_block}`}>
			<div>
				<span className={styles.attribute_name}>name:</span> {data.node.name}
			</div>
			<div>
				<span className={styles.attribute_name}>content:</span>
				<br /> {data.node.content}
			</div>
		</div>,
		styles.text_block,
	);
}

export function FileBlock({ data }: { data: { node: FileNode } }) {
	const uploadFile = (node: FileNode, filepath: File) => {
		if (filepath == undefined) return;
		node.filename = filepath.name;
		const reader = new FileReader();
		reader.onload = (event) => {
			node.content = reader.result === null ? '' : reader.result.toString();
		};
		reader.onerror = () => {
			console.log('Error loading');
		};
		reader.readAsText(filepath);
	};
	return FormulaBlockWrapper(
		<div className={`${styles.text_block}`}>
			<div>
				<span className={styles.attribute_name}>name:</span> {data.node.name}
			</div>
			<div>
				<span className={styles.attribute_name}>filename:</span> {data.node.filename}
			</div>
			<div>
				<input
					id="file_input"
					type="file"
					onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
						if (event.target.files === null) return;
						uploadFile(data.node, event.target.files[0]);
					}}
				/>
			</div>
		</div>,
		styles.text_block,
	);
}

export function ExpressionBlock({ data }: { data: { node: ExpressionNode } }) {
	return FormulaBlockWrapper(
		<div>
			<div>
				<span className={styles.attribute_name}>name:</span> {data.node.name}
			</div>
			<div>
				<span className={styles.attribute_name}>content:</span> {data.node.content}
			</div>
			<div>
				<span className={styles.attribute_name}>result:</span> {data.node.result}
			</div>
		</div>,
		styles.expression_block,
	);
}

// export function FunctionBlock({ data }: { data: { node: FunctionNode } }) {
// 	return FormulaBlockWrapper(
// 		<div>
// 			<div>
// 				name: {data.node.getName()}(
// 				{data.node
// 					.getArgs()
// 					.map((arg) => arg.name + ': ' + arg.type)
// 					.join(', ')}
// 				)
// 			</div>
// 		</div>,
// 	);
// }
