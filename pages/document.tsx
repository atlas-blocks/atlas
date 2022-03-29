import React, {
	useState,
	useRef,
	MutableRefObject,
	useEffect,
	MouseEvent as ReactMouseEvent,
} from 'react';
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
	isNode,
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
import { node } from 'prop-types';

const document = new Document('document_name');
const page = document.getPage(0);
page.getGraph().addNode(
	new ExpressionNode('', 'description1', '2 + 1 + y', 0).setPosition({ x: 200, y: 200 }),
);
page.getGraph().addNode(
	new ExpressionNode('', 'description2', 'x + 2', 0).setPosition({ x: 200, y: 300 }),
);
page.getGraph().addNode(
	new SimplifyNode('name3', new ExpressionNode('', 'description1', '2 + 1 + y', 0)).setPosition({
		x: 400,
		y: 200,
	}),
);

const initialElements: Elements = WebInterfaceUtils.getBlocks(page.getGraph());

const DnDFlow: NextPage = () => {
	const [nodeLatex, setNodeLatex] = useState('');
	const [selectedNode, setSelectedNode] = useState<Node | null>(null);

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

	const reactFlowWrapper = useRef(null);
	const mathInputRef = useRef<MathInput>(null);
	const [reactFlowInstance, setReactFlowInstance] = useState(null);
	const [elements, setElements] = useState(initialElements);
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
		let newNode: Block;
		switch (type) {
			case ExpressionNode.name:
				newNode = WebInterfaceUtils.toBlock(
					new ExpressionNode('', 'my_description', '', 0).setPosition(pos),
				);
				break;
			case SimplifyNode.name:
				newNode = WebInterfaceUtils.toBlock(
					new SimplifyNode(
						'',
						new ExpressionNode('', 'my_description', '', 0).setPosition(pos),
					),
				);
				break;
		}

		setElements((es) => es.concat(newNode));
	};

	useEffect(() => {
		if (selectedNode === null) return;
		(selectedNode as FormulaNode).updateLatex(nodeLatex);

		setElements((els) => WebInterfaceUtils.getBlocks(page.getGraph()));
	}, [nodeLatex, selectedNode, setElements]);

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
				<BlockSettings node={selectedNode} />
				<MathInput nodeLatex={nodeLatex} setNodeLatex={setNodeLatex} ref={mathInputRef} />
			</ReactFlowProvider>
		</div>
	);
};

export default DnDFlow;
