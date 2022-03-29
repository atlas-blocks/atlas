import React, { useState, useRef, useEffect, MouseEvent as ReactMouseEvent } from 'react';
import Document from '../commons/Document';
import dynamic from 'next/dynamic';

const Background = dynamic(
	// @ts-ignore
	// without it Next.js don't load background correctly and prints an error in the console.
	import('react-flow-renderer').then((mod) => mod.Background),
	{ ssr: false },
); // disable ssr
import ReactFlow, {
	addEdge,
	removeElements,
	Controls,
	Edge,
	Node as Block,
	Elements,
	Connection,
	ReactFlowProvider,
	MiniMap,
} from 'react-flow-renderer';

import { nodeTypes } from '../components/blocks/Blocks';
import { edgeTypes } from '../components/blocks/Edge';

import Sidebar from '../components/document/Sidebar';
import BlockSettings from '../components/document/BlockSettings';
import MathInput from '../components/document/MathInput';

import Node from '../commons/nodes/Node';
import ExpressionNode from '../commons/nodes/formulas/ExpressionNode';
import SimplifyNode from '../commons/nodes/formulas/SimplifyNode';
import WebInterfaceUtils from '../utils/WebInterfaceUtils';
import FormulaNode from '../commons/nodes/formulas/FormulaNode';

import { NextPage } from 'next';
import styles from '../styles/DnDFlow.module.css';

export const document = new Document('document_name');
export const page = document.getPage(0);

const expressionNode0 = new ExpressionNode('', 'description1', '2 + 1 + y', 0).setPosition({
	x: 400,
	y: 200,
});
const expressionNode1 = new ExpressionNode('', 'description2', 'x + 2', 0).setPosition({
	x: 500,
	y: 500,
});
const simplifyNode0 = new SimplifyNode('name3', expressionNode1).setPosition({ x: 400, y: 300 });
page.getGraph().addNode(expressionNode0);
page.getGraph().addNode(expressionNode1);
page.getGraph().addNode(simplifyNode0);

const DnDFlow: NextPage = () => {
	const [nodeLatex, setNodeLatex] = useState('');
	const [selectedNode, setSelectedNode] = useState<Node | null>(null);
	const [haveChanges, setHaveChanges] = useState<boolean>(false);
	const reactFlowWrapper = useRef(null);
	const mathInputRef = useRef<MathInput>(null);
	const [reactFlowInstance, setReactFlowInstance] = useState(null);
	const initialElements: Elements = WebInterfaceUtils.getElements(page.getGraph());
	const [elements, setElements] = useState(initialElements);

	const webInterfaceUtils = new WebInterfaceUtils(
		page.getGraph(),
		setElements,
		haveChanges,
		setHaveChanges,
	);

	function handleBlockSelection(event: React.MouseEvent, element: Block | Edge) {}

	function handleBlockDoubleClick(event: ReactMouseEvent, block: Block) {
		setSelectedNode(block.data.node);
		if (block.data.node instanceof FormulaNode) {
			setNodeLatex((block.data.node as FormulaNode).toLatex());
			// @ts-ignore
			mathInputRef.current.showMathInput();
		}
	}

	function onPaneClick(event: ReactMouseEvent) {
		setSelectedNode(null);
		// @ts-ignore
		mathInputRef.current.hideMathInput();
	}

	const onConnect = (params: Edge | Connection) =>
		setElements((els: Elements) => addEdge({ ...params, type: 'defaultEdge' }, els));
	const onElementsRemove = (elementsToRemove: Elements) =>
		setElements((els: Elements) => removeElements(elementsToRemove, els));

	const onLoad = (_reactFlowInstance: React.SetStateAction<any>) =>
		setReactFlowInstance(_reactFlowInstance);

	const onDragOver = (event: React.DragEvent) => {
		event.preventDefault();
		event.dataTransfer.dropEffect = 'move';
	};

	const onDrop = (event: React.DragEvent) => {
		event.preventDefault();
		// @ts-ignore
		const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
		const type = event.dataTransfer.getData('application/reactflow');
		// @ts-ignore
		const pos = reactFlowInstance.project({
			x: event.clientX - reactFlowBounds.left,
			y: event.clientY - reactFlowBounds.top,
		});
		let newNode: Node;
		switch (type) {
			case ExpressionNode.name:
				newNode = ExpressionNode.getNewBlock(pos);
				break;
			case SimplifyNode.name:
				newNode = SimplifyNode.getNewBlock(pos);
				break;
			default:
				throw new Error();
		}

		page.getGraph().addNode(newNode);
		webInterfaceUtils.refreshElements();
	};

	useEffect(() => {
		if (selectedNode === null) return;
		(selectedNode as FormulaNode).updateLatex(nodeLatex);
		webInterfaceUtils.refreshElements();
	}, [nodeLatex, selectedNode, setElements, haveChanges]);

	return (
		<div className={styles.dndflow}>
			<ReactFlowProvider>
				<div className={styles['reactflow-wrapper']} ref={reactFlowWrapper}>
					<ReactFlow
						id={styles.blocks_canvas}
						elements={elements}
						nodeTypes={nodeTypes}
						edgeTypes={edgeTypes}
						onConnect={onConnect}
						onElementsRemove={onElementsRemove}
						onElementClick={handleBlockSelection}
						onNodeDoubleClick={handleBlockDoubleClick}
						onPaneClick={onPaneClick}
						onLoad={onLoad}
						onDrop={onDrop}
						onDragOver={onDragOver}
					>
						<MiniMap />
						<Controls />
						<Background />
					</ReactFlow>
				</div>
				<Sidebar />
				<BlockSettings node={selectedNode} webInterfaceUtils={webInterfaceUtils} />
				<MathInput nodeLatex={nodeLatex} setNodeLatex={setNodeLatex} ref={mathInputRef} />
			</ReactFlowProvider>
		</div>
	);
};

export default DnDFlow;
