import React, { useState, useRef, MutableRefObject, useEffect, MouseEvent as ReactMouseEvent } from 'react';
import dynamic from 'next/dynamic';
// @ts-ignore
// without it Next.js don't load background correctly and prints an error in the console.
const Background = dynamic(import('react-flow-renderer').then(mod => mod.Background), { ssr: false }); // disable ssr
import ReactFlow, {
	addEdge, removeElements, Controls, Edge, Node, Elements, Connection, ReactFlowProvider,
	MiniMap, isNode,
} from 'react-flow-renderer';

import { nodeTypes } from '../components/blocks/Blocks';
import { edgeTypes } from '../components/blocks/Edge';
import Sidebar from '../components/document/Sidebar';

import styles from '../styles/DnDFlow.module.css';
import { NextPage } from 'next';
import MathInput from '../components/document/MathInput';

let id = 0;
const getId = () => `block_${id++}`;

const initialElements: Elements = [
	{
		id: '1',
		type: 'defaultBlock',
		data: { label: '2 + 1 + y' },
		position: { x: 300, y: 100 },
	},
	{
		id: '2',
		type: 'simplifyBlock',
		data: { label: 'y + 3' },
		position: { x: 250, y: 250 },
	},
	{
		id: '3',
		type: 'defaultBlock',
		data: { label: 'x + 2' },
		position: { x: 350, y: 350 },
	},
	{ id: 'e1-2', type: 'defaultEdge', source: '1', target: '2', animated: true },
];

const DnDFlow: NextPage = () => {
	const [nodeLatex, setNodeLatex] = useState('0');
	const [currentSelectionID, setCurrentSelectionID] = useState<string | null>(null);

	function handleBlockSelection(event: React.MouseEvent, element: Node | Edge) {
		setCurrentSelectionID(element.id);
	}

	function handleBlockDoubleClick(event: ReactMouseEvent, node: Node) {
		setCurrentSelectionID(node.id);
		setNodeLatex(node.data.label);
		// @ts-ignore
		mathInputRef.current.showMathInput();
	}

	function onPaneClick(event: ReactMouseEvent) {
		setCurrentSelectionID(null);
		// @ts-ignore
		mathInputRef.current.hideMathInput();
	}

	const reactFlowWrapper = useRef(null);
	const mathInputRef = useRef<MathInput>(null);
	const [reactFlowInstance, setReactFlowInstance] = useState(null);
	const [elements, setElements] = useState(initialElements);
	const onConnect = (params: Edge | Connection) => setElements((els: Elements) => addEdge(params, els));
	const onElementsRemove = (elementsToRemove: Elements) =>
		setElements((els: Elements) => removeElements(elementsToRemove, els));

	const onLoad = (_reactFlowInstance: React.SetStateAction<any>) => setReactFlowInstance(_reactFlowInstance);

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
		const position = reactFlowInstance.project({
			x: event.clientX - reactFlowBounds.left,
			y: event.clientY - reactFlowBounds.top,
		});
		const newNode = {
			id: getId(),
			type,
			position,
			data: { label: type },
		};
		setElements((es) => es.concat(newNode));
	};

	useEffect(() => {
		setElements((els) =>
			els.map((el) => {
				if (el.id === currentSelectionID) {
					// it's important that you create a new object here
					// in order to notify react flow about the change
					el.data = {
						...el.data,
						label: nodeLatex,
					};
				}
				return el;
			}),
		);
	}, [nodeLatex, setElements]);

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
				<MathInput nodeLatex={nodeLatex} setNodeLatex={setNodeLatex} ref={mathInputRef} />
			</ReactFlowProvider>
		</div>
	);
};

export default DnDFlow;
