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
	webInterfaceUtils: WebInterfaceUtils;
};

export default function DnDFlow({ druggedNode, webInterfaceUtils }: Props): JSX.Element {
	const [reactFlowInstance, setReactFlowInstance] = useState<ReactFlowInstance | null>(null);
	const reactFlowWrapper = useRef<HTMLDivElement | null>(null);
	const [uiNodes, setUiNodes] = useState(WebInterfaceUtils.getUiNodes(atlasGraph));
	const [uiEdges, setUiEdges] = useState(WebInterfaceUtils.getUiEdges(atlasGraph));

	const onUiNodesChange = useCallback(
		(changes: UINodeChange[]) => {
			webInterfaceUtils.updateNodes(changes);
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
		webInterfaceUtils.setSelectedNode(node.data.node);
	}

	function onPaneClick(event: ReactMouseEvent) {
		webInterfaceUtils.setSelectedNode(null);
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
				const width = webInterfaceUtils.getUiNodeWidth(druggedNode);
				const height = webInterfaceUtils.getUiNodeHeight(druggedNode);
				// @ts-ignore
				const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
				// @ts-ignore
				const pos = reactFlowInstance.project({
					x: event.clientX - reactFlowBounds.left - height / 2,
					y: event.clientY - reactFlowBounds.top - height / 2,
				});
				atlasGraph.nodes.push(druggedNode.setPosition(pos.x, pos.y).setDefaultName());
			}
			setUiNodes(WebInterfaceUtils.getUiNodes(atlasGraph));
		},
		[reactFlowInstance, druggedNode],
	);

	useEffect(() => {
		setUiNodes(WebInterfaceUtils.getUiNodes(webInterfaceUtils.graph));
		setUiEdges(WebInterfaceUtils.getUiEdges(webInterfaceUtils.graph));
	}, [webInterfaceUtils.graph.nodes]);

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
					onPaneClick={onPaneClick}
					onInit={setReactFlowInstance}
					onDrop={onDrop}
					onDragOver={onDragOver}
				>
					{/*<MiniMap />*/}
					<Controls />
					<Background />
				</ReactFlow>
			</div>
		</ReactFlowProvider>
	);
}
