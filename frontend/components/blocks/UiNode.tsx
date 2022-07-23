import React, { useState } from 'react';
import { Handle, Position } from 'react-flow-renderer';

import styles from '../../styles/Block.module.css';

import AtlasNode from '../../src/graph/nodes/AtlasNode';
import ExpressionNode, { ResultPart, ExecutionError } from '../../src/graph/nodes/ExpressionNode';
import TextNode from '../../src/graph/nodes/TextNode';
import FileNode from '../../src/graph/nodes/FileNode';
import SelectionNode from '../../src/graph/nodes/SelectionNode';
import MatrixFilterNode from '../../src/graph/nodes/MatrixFilterNode';
import ObjectNode from '../../src/graph/nodes/ObjectNode';
import DesmosNode from '../../src/graph/nodes/DesmosNode';

import { atlasModule } from '../../src/utils/AtlasModule';
import { wiu } from '../../src/utils/WebInterfaceUtils';
import { awu } from '../../src/utils/AtlasWindowUtils';

import FileUtils from '../../src/utils/FileUtils';
import DesmosFlow from '../../src/flows/DesmosFlow';

export const uiNodeTypes = {
	[ExpressionNode.ui_type]: ExpressionBlock,
	[TextNode.ui_type]: TextBlock,
	[FileNode.ui_type]: FileBlock,
	[SelectionNode.ui_type]: SelectionBlock,
	[MatrixFilterNode.ui_type]: MatrixFilterBlock,
	[ObjectNode.ui_type]: ObjectBlock,
	[DesmosNode.ui_type]: DesmosBlock,
};

function renderResultPart(part: ResultPart): JSX.Element {
	if (part['text/html'] !== undefined) {
		return <div dangerouslySetInnerHTML={{ __html: part['text/html'] }}></div>;
	} else if (part['text/plain'] !== undefined) {
		return <div>{part['text/plain']}</div>;
	}
	return <></>;
}

function renderResult(result: ResultPart[] | null): JSX.Element {
	if (result === null) return <></>;
	return (
		<>
			{result.map((part, index) => (
				<div key={index}>{renderResultPart(part)}</div>
			))}
		</>
	);
}

function renderExecutionError(error: ExecutionError | null): JSX.Element | null {
	return error === null ? null : <>{error.traceback.join('\n')}</>;
}

function blockWrapper(node: AtlasNode, tail?: JSX.Element | string): JSX.Element {
	const selectedBlockStyle = wiu.selectedNode === node ? styles.selectedBlock : '';

	return (
		<div className={styles.block + ' ' + selectedBlockStyle}>
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

function errorWrapper(error: JSX.Element | null): JSX.Element {
	return <div className={error !== null ? styles.error : styles.invisible}>{error}</div>;
}

function TextBlock({ data: { node } }: { data: { node: TextNode } }) {
	return blockWrapper(node, contentWrapper(node.getContent()));
}

// UI Blocks
function FileBlock({ data: { node } }: { data: { node: FileNode } }) {
	const [showContent, setShowContent] = useState<boolean>(false);

	const uploadFile = (event: React.ChangeEvent<HTMLInputElement>) => {
		if (event.target.files === null) return;
		FileUtils.getFileContentString(event.target.files[0], (content: string) =>
			node.setContent(content),
		);
		node.setUiFilename(event.target.files[0].name);
	};
	const showFileContent = (event: React.ChangeEvent<HTMLInputElement>) => {
		event.target.checked ? setShowContent(true) : setShowContent(false);
	};

	return blockWrapper(
		node,
		<>
			{contentWrapper(
				<>
					<input className={styles.inputFile} type="file" onChange={uploadFile} />
					<div className={styles.thickLine}>Imported file: {node.ui_filename}</div>
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
				{resultWrapper(node.getContent())}
			</div>
		</>,
	);
}

function ExpressionBlock({ data: { node } }: { data: { node: ExpressionNode } }) {
	return blockWrapper(
		node,
		<>
			{contentWrapper(node.getContent())}
			{resultWrapper(renderResult(node.getResult()))}
			{errorWrapper(renderExecutionError(node.getError()))}
		</>,
	);
}

function DesmosBlock({ data: { node } }: { data: { node: DesmosNode } }) {
	return blockWrapper(
		node,
		<>
			{contentWrapper(node.getContent())}
			{resultWrapper(renderResult(node.getResult()))}
			{errorWrapper(renderExecutionError(node.getError()))}
			<button
				onClick={() => {
					awu.addAndSelectFlow(new DesmosFlow(node));
				}}
			>
				Open
			</button>
		</>,
	);
}

function MatrixFilterBlock({ data: { node } }: { data: { node: MatrixFilterNode } }) {
	return blockWrapper(
		node,
		<>
			{resultWrapper(renderResult(node.getResult()))}
			{errorWrapper(renderExecutionError(node.getError()))}
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
			<select
				className={styles.selectionBlock}
				value={selectedOption}
				onChange={handleSelect}
			>
				{options.map((option: string, index: number) => getOption(option, index + 1))}
			</select>
		);
	};

	return blockWrapper(
		node,
		<>
			{contentWrapper(getSelectionContent(node.getOptions()))}
			{errorWrapper(renderExecutionError(node.getError()))}
		</>,
	);
}

function ObjectBlock({ data: { node } }: { data: { node: ObjectNode } }) {
	return blockWrapper(
		node,
		<>
			{resultWrapper(renderResult(node.getResult()))}
			{errorWrapper(renderExecutionError(node.getError()))}
		</>,
	);
}
