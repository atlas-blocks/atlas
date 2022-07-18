import React, { useState, useCallback, useRef } from 'react';
import ReactFlow, {
	Controls,
	Background,
	addEdge as addUiEdge,
	applyNodeChanges,
	applyEdgeChanges,
	Node as UINode,
	EdgeChange as UIEdgeChange,
	NodeChange as UINodeChange,
	Connection,
	ReactFlowProvider,
	ReactFlowInstance,
} from 'react-flow-renderer';

import { uiNodeTypes } from '../../blocks/UiNode';
import { uiEdgeTypes } from '../../blocks/UiEdge';
import { wiu } from '../../../src/utils/WebInterfaceUtils';
import StorageUtils from '../../../src/utils/StorageUtils';

export default function AtlasGraphTab(): JSX.Element {
	const [reactFlowInstance, setReactFlowInstance] = useState<ReactFlowInstance | null>(null);
	const reactFlowWrapper = useRef<HTMLDivElement | null>(null);

	const onUiNodesChange = (changes: UINodeChange[]) => {
		wiu.updateNodes(changes);
		wiu.setUiNodes((nds) => applyNodeChanges(changes, nds));
		StorageUtils.saveGraphToLocalStorage(wiu.graph);
	};
	const onUiEdgesChange = (changes: UIEdgeChange[]) =>
		wiu.setUiEdges((eds) => applyEdgeChanges(changes, eds));

	function handleUiNodeSelection(event: React.MouseEvent, node: UINode) {
		// any user change of edges is ignored
	}

	function handleUiNodeDoubleClick(event: React.MouseEvent, node: UINode) {
		wiu.setSelectedNode(node.data.node);
	}

	function onPanelClick(event: React.MouseEvent) {
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

				if (reactFlowWrapper.current == null) throw new Error();
				const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();

				if (reactFlowInstance == null) throw new Error();
				const pos = reactFlowInstance.project({
					x: event.clientX - reactFlowBounds.left - width / 2,
					y: event.clientY - reactFlowBounds.top - height / 2,
				});
				wiu.graph.nodes.push(wiu.druggedNode.setUiPosition(pos.x, pos.y));
			}
			wiu.refreshUiElements();
			wiu.setSelectedNode(wiu.druggedNode);
		},
		[reactFlowInstance],
	);

	return (
		<ReactFlowProvider>
			<div ref={reactFlowWrapper} style={{ width: '100%', height: '100%' }}>
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
					deleteKeyCode={['Backspace', 'Delete']}
				>
					{/*<MiniMap />*/}
					<Controls />
					<Background />
				</ReactFlow>
			</div>
		</ReactFlowProvider>
	);
}
