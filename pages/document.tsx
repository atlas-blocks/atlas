import React, { useState, useRef } from 'react';
import dynamic from 'next/dynamic'
// @ts-ignore
const Background = dynamic(import('react-flow-renderer').then(mod => mod.Background), { ssr: false }) // disable ssr
import ReactFlow, {
	addEdge, removeElements, Controls, Edge, Elements, Connection, ReactFlowProvider,
	MiniMap,
} from 'react-flow-renderer';

import { DefaultBlock, SimplifyBlock } from '../components/blocks/Blocks';
import { DefaultEdge } from '../components/blocks/Edge';
import Sidebar from '../components/document/Sidebar';

import styles from '../styles/DnDFlow.module.css';
import { NextPage } from 'next';

const initialElements: Elements = [
	{ id: '1', data: { label: 'Node 1' }, position: { x: 300, y: 100 } },
	{
		id: '2',
		type: 'output',
		data: { label: 'output node' },
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

let id = 0;
const getId = () => `dndnode_${id++}`;

const nodeTypes = {
	defaultBlock: DefaultBlock,
	simplifyBlock: SimplifyBlock,
};
const edgeTypes = {
	defaultEdge: DefaultEdge,
};

const DnDFlow: NextPage = () => {
	const reactFlowWrapper = useRef(null);
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
			</ReactFlowProvider>
		</div>
	);
};

export default DnDFlow;

