import styles from '../../styles/main.module.css';
import React, { useState, useCallback, useRef, useEffect } from 'react';
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
import StorageUtils from '../../utils/StorageUtils';
import { SelectNode } from '../../utils/AtlasGraph';

type Props = {
	wiu: WebInterfaceUtils;
};

export default function DnDFlow({ wiu }: Props): JSX.Element {
	const [reactFlowInstance, setReactFlowInstance] = useState<ReactFlowInstance | null>(null);
	const reactFlowWrapper = useRef<HTMLDivElement | null>(null);
	const [selectedOptionState, setSelectedOptionState] = useState<number>(0);

	const onUiNodesChange = useCallback(
		(changes: UINodeChange[]) => {
			wiu.updateNodes(changes);
			wiu.setUiNodes((nds) => applyNodeChanges(changes, nds));
		},
		[wiu.setUiNodes],
	);
	const onUiEdgesChange = useCallback(
		(changes: UIEdgeChange[]) => wiu.setUiEdges((eds) => applyEdgeChanges(changes, eds)),
		[wiu.setUiEdges],
	);

	function handleUiNodeSelection(event: React.MouseEvent, node: UINode) {
		event.preventDefault();

		if (node.data.node instanceof SelectNode) {
			const regexforVectorName = /(.*)(\[[^\]]+\]$)/;
			const extractVectorName = node.data.node.content.match(regexforVectorName);

			if (extractVectorName) {
				node.data.node.content =
					extractVectorName[1] +
					'[' +
					(node.data.node.selectedOption + 1).toString() +
					']';
				setSelectedOptionState(node.data.node.selectedOption);
			}
		}
	}

	const updateGraph = async () => await wiu.updateGraph();
	useEffect(() => {
		updateGraph();
	}, [selectedOptionState]);

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

	useEffect(() => {
		StorageUtils.saveGraphToLocalStorage(wiu.graph);
	}, [wiu.uiNodes, wiu.uiEdges]);

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
			<div className={styles.flowCanvas} ref={reactFlowWrapper}>
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
