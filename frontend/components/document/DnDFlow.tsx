import styles from '../../styles/main.module.css';
import React, {
	useState,
	useCallback,
	useRef,
	useEffect,
	MouseEvent as ReactMouseEvent,
} from 'react';
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
import AtlasGraph, { AtlasNode } from '../../utils/AtlasGraph';
import WebInterfaceUtils from '../../utils/WebInterfaceUtils';
import { exampleNodes } from '../blocks/ExampleNodes';

export const atlasGraph = new AtlasGraph();
exampleNodes.forEach((node) => atlasGraph.nodes.push(node));

type Props = {
	druggedNode: AtlasNode | null;
	wiu: WebInterfaceUtils;
};

export default function DnDFlow({ druggedNode, wiu }: Props): JSX.Element {
	const [reactFlowInstance, setReactFlowInstance] = useState<ReactFlowInstance | null>(null);
	const reactFlowWrapper = useRef<HTMLDivElement | null>(null);
	const [uiNodes, setUiNodes] = useState(WebInterfaceUtils.getUiNodes(atlasGraph));
	const [uiEdges, setUiEdges] = useState(WebInterfaceUtils.getUiEdges(atlasGraph));

	const onUiNodesChange = useCallback(
		(changes: UINodeChange[]) => {
			wiu.updateNodes(changes);
			setUiNodes((nds) => applyNodeChanges(changes, nds));
		},
		[setUiNodes],
	);
	const onUiEdgesChange = useCallback(
		(changes: UIEdgeChange[]) => setUiEdges((eds) => applyEdgeChanges(changes, eds)),
		[setUiEdges],
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
			setUiEdges((eds) => addUiEdge({ ...connection, type: 'defaultEdge' }, eds)),
		[],
	);

	const onDragOver = useCallback((event: React.DragEvent) => {
		event.preventDefault();
		event.dataTransfer.dropEffect = 'move';
	}, []);

	const onDrop = useCallback(
		(event: React.DragEvent) => {
			event.preventDefault();

			console.assert(druggedNode !== null, 'drugged node should be assigned before dragging');
			if (druggedNode !== null) {
				const width = wiu.getUiNodeWidth(druggedNode);
				const height = wiu.getUiNodeHeight(druggedNode);
				// @ts-ignore
				const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
				// @ts-ignore
				const pos = reactFlowInstance.project({
					x: event.clientX - reactFlowBounds.left - width / 2,
					y: event.clientY - reactFlowBounds.top - height / 2,
				});
				atlasGraph.nodes.push(druggedNode.setPosition(pos.x, pos.y));
			}
			setUiNodes(WebInterfaceUtils.getUiNodes(atlasGraph));
			wiu.setSelectedNode(druggedNode);
		},
		[reactFlowInstance, druggedNode],
	);

	useEffect(() => {
		setUiNodes(WebInterfaceUtils.getUiNodes(wiu.graph));
		setUiEdges(WebInterfaceUtils.getUiEdges(wiu.graph));
	}, [wiu.graph.nodes]);

	return (
		<ReactFlowProvider>
			<div className={styles.flowcanvas} ref={reactFlowWrapper}>
				<ReactFlow
					nodes={uiNodes}
					edges={uiEdges}
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
