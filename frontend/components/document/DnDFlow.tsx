import React, {
	useState,
	useCallback,
	useRef,
	useEffect,
	MouseEvent as ReactMouseEvent,
} from 'react';
import dynamic from 'next/dynamic';

// const Background = dynamic(
// 	// @ts-ignore
// 	// without it Next.js don't load background correctly and prints an error in the console.
// 	import('react-flow-renderer').then((mod) => mod.Background),
// 	{ ssr: false },
// ); // disable ssr
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
	useNodesState as useUiNodesState,
	useEdgesState as useUiEdgesState,
	Connection,
	ReactFlowProvider,
	ReactFlowInstance,
} from 'react-flow-renderer';

import { uiNodeTypes } from '../blocks/UiNode';
import { uiEdgeTypes } from '../blocks/UiEdge';

import BlockMenu from './BlockMenu';
import MathInput from './MathInput';

import AtlasGraph, { AtlasNode, ContentNode } from '../../utils/AtlasGraph';
import WebInterfaceUtils from '../../utils/WebInterfaceUtils';

import { NextPage } from 'next';
import styles from '../../styles/main.module.css';

import { exampleNodes } from '../blocks/ExampleNodes';

export const atlasGraph = new AtlasGraph();
exampleNodes.forEach((node) => atlasGraph.nodes.push(node));

const DnDFlow: NextPage = () => {
	const [reactFlowInstance, setReactFlowInstance] = useState<ReactFlowInstance | null>(null);
	const [selectedNode, setSelectedNode] = useState<AtlasNode | null>(null);
	const [druggedNode, setDruggedNode] = useState<AtlasNode | null>(null);
	const reactFlowWrapper = useRef<HTMLDivElement | null>(null);
	const mathInputRef = useRef<MathInput>(null);
	const [uiNodes, setUiNodes] = useState(WebInterfaceUtils.getUiNodes(atlasGraph));
	const [uiEdges, setUiEdges] = useState(WebInterfaceUtils.getUiEdges(atlasGraph));
	const webInterfaceUtils = new WebInterfaceUtils(
		atlasGraph,
		setUiNodes,
		setUiEdges,
		setSelectedNode,
	);

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

	function handleUiNodeDoubleClick(event: ReactMouseEvent, block: UINode) {
		setSelectedNode(block.data.node);
		if (block.data.node instanceof ContentNode) {
			(mathInputRef.current as MathInput).show(block.data.node.content);
		}
	}

	function onPaneClick(event: ReactMouseEvent) {
		setSelectedNode(null);
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
			// @ts-ignore
			const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
			// @ts-ignore
			const pos = reactFlowInstance.project({
				x: event.clientX - reactFlowBounds.left,
				y: event.clientY - reactFlowBounds.top,
			});

			console.assert(druggedNode !== null, 'drugged node should be assigned before dragging');
			if (druggedNode !== null)
				atlasGraph.nodes.push(druggedNode.setPosition(pos.x, pos.y).setDefaultName());
			webInterfaceUtils.refreshUiElements();
		},
		[reactFlowInstance, druggedNode],
	);

	useEffect(() => {
		webInterfaceUtils.refreshUiElements();
	}, [selectedNode, setUiNodes]);

	useEffect(() => {
		if (selectedNode === null) (mathInputRef.current as MathInput).hide();
	}, [selectedNode]);

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
				<BlockMenu
					webInterfaceUtils={webInterfaceUtils}
					selectedNode={selectedNode}
					setDruggedNode={setDruggedNode}
				/>
				{/*<BlockSettings selectedNode={selectedNode} webInterfaceUtils={webInterfaceUtils} />*/}
				<MathInput
					selectedNode={selectedNode}
					webInterfaceUtils={webInterfaceUtils}
					ref={mathInputRef}
				/>
			</div>
		</ReactFlowProvider>
	);
};

export default DnDFlow;
