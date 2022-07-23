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

import { awu } from '../../../src/utils/AtlasWindowUtils';
import DesmosFlow from '../../../src/flows/DesmosFlow';
import DesmosNode from '../../../src/graph/nodes/DesmosNode';

const onDropMap = {
	[DesmosNode.ui_type]: (node: DesmosNode) => awu.addAndSelectFlow(new DesmosFlow(node)),
};

export default function UiAtlasGraphFlow(): JSX.Element {
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
		wiu.setSelectedNode(node.data.node);
	}

	function handleUiNodeDoubleClick(event: React.MouseEvent, node: UINode) {
		// double click is ignored
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

			const node = wiu.druggedNode;
			console.assert(node !== null, 'drugged node should be assigned before dragging');
			if (node !== null) {
				const width = wiu.getUiNodeWidth(node);
				const height = wiu.getUiNodeHeight(node);

				if (reactFlowWrapper.current == null) throw new Error();
				const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();

				if (reactFlowInstance == null) throw new Error();
				const pos = reactFlowInstance.project({
					x: event.clientX - reactFlowBounds.left - width / 2,
					y: event.clientY - reactFlowBounds.top - height / 2,
				});
				wiu.graph.nodes.push(node.setUiPosition(pos.x, pos.y));
				if (onDropMap[node.ui_type]) {
					console.log('bbb');
					onDropMap[node.ui_type](node as any);
				}
			}
			wiu.refreshUiElements();
			wiu.setSelectedNode(node);
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
