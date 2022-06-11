import styles from '../../styles/main.module.css';
import React, { useState, useCallback, useRef, MouseEvent as ReactMouseEvent } from 'react';
import ReactFlow, {
	Controls,
	Background,
	addEdge as addUiEdge,
	applyNodeChanges,
	applyEdgeChanges,
	Edge as UIEdge,
	Node as UINode,
	EdgeChange as UIEdgeChange,
	NodeChange as UINodeChange,
	Connection,
	ReactFlowProvider,
	ReactFlowInstance,
} from 'react-flow-renderer';

import { uiNodeTypes } from '../blocks/UiNode';
import { uiEdgeTypes } from '../blocks/UiEdge';
import WebInterfaceUtils from '../../utils/WebInterfaceUtils';

type Props = {
	wiu: WebInterfaceUtils;
};

export default function DnDFlow({ wiu }: Props): JSX.Element {
	const [reactFlowInstance, setReactFlowInstance] = useState<ReactFlowInstance | null>(null);
	const reactFlowWrapper = useRef<HTMLDivElement | null>(null);

	const onUiNodesChange = useCallback(
		(changes: UINodeChange[]) => {
			wiu.updateNodes(changes);
			wiu.setUiNodes((nds) => applyNodeChanges(changes, nds));
		},
		[wiu.graph.name, wiu.setUiNodes],
	);
	const onUiEdgesChange = useCallback(
		(changes: UIEdgeChange[]) => wiu.setUiEdges((eds) => applyEdgeChanges(changes, eds)),
		[wiu.setUiEdges],
	);

	function handleUiNodeSelection(event: React.MouseEvent, element: UINode) {}

	function handleUiNodeDoubleClick(event: ReactMouseEvent, node: UINode) {
		wiu.setSelectedNode(node.data.node);
	}

	function onPanelClick(event: ReactMouseEvent) {
		wiu.setSelectedNode(null);
	}

	const onConnect = useCallback(
		(connection: Connection) =>
			wiu.setUiEdges((eds) => addUiEdge({ ...connection, type: 'defaultEdge' }, eds)),
		[],
	);

	const onDragOver = useCallback((event: React.DragEvent) => {
		event.preventDefault();
		event.dataTransfer.dropEffect = 'move';
	}, []);

	const onDrop = useCallback(
		(event: React.DragEvent) => {
			event.preventDefault();

			console.assert(
				wiu.druggedNode !== null,
				'drugged node should be assigned before dragging',
			);
			if (wiu.druggedNode !== null) {
				const width = wiu.getUiNodeWidth(wiu.druggedNode);
				const height = wiu.getUiNodeHeight(wiu.druggedNode);
				// @ts-ignore
				const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
				// @ts-ignore
				const pos = reactFlowInstance.project({
					x: event.clientX - reactFlowBounds.left - width / 2,
					y: event.clientY - reactFlowBounds.top - height / 2,
				});
				wiu.graph.nodes.push(wiu.druggedNode.setPosition(pos.x, pos.y));
			}
			wiu.refreshUiElements();
			wiu.setSelectedNode(wiu.druggedNode);
		},
		[reactFlowInstance, wiu.druggedNode],
	);

	return (
		<ReactFlowProvider>
			<div className={styles.flowcanvas} ref={reactFlowWrapper}>
				<ReactFlow
					nodes={wiu.uiNodes}
					edges={wiu.uiEdges}
					nodeTypes={uiNodeTypes}
					edgeTypes={uiEdgeTypes}
					onConnect={onConnect}
					onNodesChange={onUiNodesChange}
					onEdgesChange={onUiEdgesChange}
					onNodeClick={handleUiNodeSelection}
					onNodeDoubleClick={handleUiNodeDoubleClick}
					onPaneClick={onPanelClick}
					onInit={setReactFlowInstance}
					onDrop={onDrop}
					onDragOver={onDragOver}
					defaultZoom={0.8}
				>
					{/*<MiniMap />*/}
					<Controls />
					<Background />
				</ReactFlow>
			</div>
		</ReactFlowProvider>
	);
}
