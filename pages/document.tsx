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

import BlockMenu from '../components/document/BlockMenu';
import BlockSettings from '../components/document/BlockSettings';
import MathInput from '../components/document/MathInput';

import Node from '../commons/nodes/Node';
import ExpressionNode from '../commons/nodes/formulas/ExpressionNode';
import WebInterfaceUtils from '../utils/WebInterfaceUtils';
import FormulaNode from '../commons/nodes/formulas/FormulaNode';

import { NextPage } from 'next';
import styles from '../styles/DnDFlow.module.css';
import DefaultFunctions from '../commons/library/system/formulas/functions/DefaultFunctions';

export const document = new Document('document_name');
export const page = document.getPage(0);

const variableY = new ExpressionNode('y', '5', 0).setPosition({ x: 100, y: 100 });
const expressionNode0 = new ExpressionNode('b1', '2 + 1 + y', 0).setPosition({ x: 300, y: 100 });
const simplifyNode0 = new ExpressionNode('', 'simplify("1 + 1")', 0).setPosition({
	x: 600,
	y: 100,
});
const customFetchNode0 = new ExpressionNode(
	'fetch1',
	'fetch("/api/el_simplify", {"latex":str(y + 5 - 6)})',
	0,
).setPosition({ x: 10, y: 300 });

const mapFieldGettingNode = new ExpressionNode('getMapField1', 'fetch1["out"]', 0).setPosition({
	x: 470,
	y: 300,
});
const simplifyNode1 = new ExpressionNode('', 'simplify(getMapField1)', 0).setPosition({
	x: 700,
	y: 300,
});

const customFetchNode2 = new ExpressionNode(
	'fetch2',
	'fetch("http://18.219.169.98/cgi-bin/el_simplify.py", {"in_latex":"x+2"})',
	0,
).setPosition({ x: 10, y: 500 });

page.getGraph().addNodes(DefaultFunctions.getAllNodes());
page.getGraph().addNode(variableY);
page.getGraph().addNode(expressionNode0);
page.getGraph().addNode(simplifyNode0);
page.getGraph().addNode(customFetchNode0);
page.getGraph().addNode(customFetchNode2);
page.getGraph().addNode(mapFieldGettingNode);
page.getGraph().addNode(simplifyNode1);

(async () => {
	await variableY.updateResult(page.getGraph());
	await customFetchNode0.updateResult(page.getGraph());
	await simplifyNode0.updateResult(page.getGraph());
	await customFetchNode2.updateResult(page.getGraph());
})();

const DnDFlow: NextPage = () => {
	const [selectedNode, setSelectedNode] = useState<Node | null>(null);
	const [druggedNode, setDruggedNode] = useState<Node | null>(null);
	const reactFlowWrapper = useRef(null);
	const mathInputRef = useRef<MathInput>(null);
	const [reactFlowInstance, setReactFlowInstance] = useState(null);
	const initialElements: Elements = WebInterfaceUtils.getElements(page.getGraph());
	const [elements, setElements] = useState(initialElements);

	const webInterfaceUtils = new WebInterfaceUtils(page.getGraph(), setElements, setSelectedNode);

	function handleBlockSelection(event: React.MouseEvent, element: Block | Edge) {}

	function handleBlockDoubleClick(event: ReactMouseEvent, block: Block) {
		setSelectedNode(block.data.node);
		if (block.data.node instanceof FormulaNode)
			(mathInputRef.current as MathInput).show(block.data.node.getContent());
	}

	function onPaneClick(event: ReactMouseEvent) {
		setSelectedNode(null);
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
		// @ts-ignore
		const pos = reactFlowInstance.project({
			x: event.clientX - reactFlowBounds.left,
			y: event.clientY - reactFlowBounds.top,
		});

		console.assert(druggedNode !== null, 'drugged node should not be assigned before dragging');
		if (druggedNode !== null) page.getGraph().addNode(druggedNode.setPosition(pos));
		webInterfaceUtils.refreshElements();
	};

	useEffect(() => {
		webInterfaceUtils.refreshElements();
	}, [selectedNode, setElements]);

	useEffect(() => {
		if (selectedNode === null) (mathInputRef.current as MathInput).hide();
	}, [selectedNode]);

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
				<BlockMenu
					webInterfaceUtils={webInterfaceUtils}
					selectedNode={selectedNode}
					setDruggedNode={setDruggedNode}
				/>
				<BlockSettings selectedNode={selectedNode} webInterfaceUtils={webInterfaceUtils} />
				<MathInput
					selectedNode={selectedNode}
					webInterfaceUtils={webInterfaceUtils}
					ref={mathInputRef}
				/>
			</ReactFlowProvider>
		</div>
	);
};

export default DnDFlow;
