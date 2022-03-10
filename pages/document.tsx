import styles from '../styles/DnDFlow.module.css';
import Navbar from '../components/includes/navbar';
import React, { useState, useRef } from 'react';
import ReactFlow, {
	ReactFlowProvider,
	addEdge,
	removeElements,
	Controls, Edge, Elements, Connection,
} from 'react-flow-renderer';


import Sidebar from '../components/Sidebar';

import { Connect } from 'react-redux';

const initialElements: Elements = [
	{
		id: '1',
		type: 'input',
		data: { label: 'input node' },
		position: { x: 250, y: 250 },
	},
	{ id: '2', data: { label: 'Node 2' }, position: { x: 100, y: 100 } },
	{ id: 'e1-2', source: '1', target: '2', animated: true },
];

let id = 0;
const getId = () => `dndnode_${id++}`;

const DnDFlow = () => {
	const reactFlowWrapper = useRef(null);
	const [reactFlowInstance, setReactFlowInstance] = useState(null);
	const [elements, setElements] = useState(initialElements);
	const onConnect = (params: Edge | Connection) => setElements((els: Elements) => addEdge(params, els));
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
		const position = reactFlowInstance.project({
			x: event.clientX - reactFlowBounds.left,
			y: event.clientY - reactFlowBounds.top,
		});
		const newNode = {
			id: getId(),
			type,
			position,
			data: { label: `${type} node` },
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
						onConnect={onConnect}
						onElementsRemove={onElementsRemove}
						onLoad={onLoad}
						onDrop={onDrop}
						onDragOver={onDragOver}
					>
						<Controls />
					</ReactFlow>
				</div>
				<Sidebar />
			</ReactFlowProvider>
		</div>
	);
};

export default DnDFlow;

