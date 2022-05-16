import React, { useState, useRef, useEffect, MouseEvent as ReactMouseEvent } from 'react';
import dynamic from 'next/dynamic';

const Background = dynamic(
    // @ts-ignore
    // without it Next.js don't load background correctly and prints an error in the console.
    import('react-flow-renderer').then((mod) => mod.Background),
    { ssr: false },
); // disable ssr
import ReactFlow, {
    addEdge,
    removeElements,
    Edge,
    Node as Block,
    Elements,
    Connection,
    ReactFlowProvider,
} from 'react-flow-renderer';

import { nodeTypes } from '../blocks/Blocks';
import { edgeTypes } from '../blocks/Edge';

import BlockMenu from './BlockMenu';
import MathInput from './MathInput';

import AtlasGraph, { AtlasNode, ContentNode } from '../../utils/AtlasGraph';
import WebInterfaceUtils from '../../utils/WebInterfaceUtils';

import { NextPage } from 'next';
import styles from "../../styles/main.module.css";


import {exampleNodes} from "../blocks/ExampleNodes";


export const atlasGraph = new AtlasGraph();
exampleNodes.forEach((node) => atlasGraph.nodes.push(node));

const DnDFlow: NextPage = () => {
    const [selectedNode, setSelectedNode] = useState<AtlasNode | null>(null);
    const [druggedNode, setDruggedNode] = useState<AtlasNode | null>(null);
    const reactFlowWrapper = useRef(null);
    const mathInputRef = useRef<MathInput>(null);
    const [reactFlowInstance, setReactFlowInstance] = useState(null);
    const initialElements: Elements = WebInterfaceUtils.getElements(atlasGraph);
    const [elements, setElements] = useState(initialElements);

    const webInterfaceUtils = new WebInterfaceUtils(atlasGraph, setElements, setSelectedNode);

    function handleBlockSelection(event: React.MouseEvent, element: Block | Edge) {}

    function handleBlockDoubleClick(event: ReactMouseEvent, block: Block) {
        setSelectedNode(block.data.node);
        if (block.data.node instanceof ContentNode) {
            (mathInputRef.current as MathInput).show(block.data.node.content);
        }
    }

    function onPaneClick(event: ReactMouseEvent) {
        setSelectedNode(null);
    }

    const onConnect = (params: Edge | Connection) =>
        setElements((els: Elements) => addEdge({ ...params, type: 'defaultEdge' }, els));
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
        // @ts-ignore
        const pos = reactFlowInstance.project({
            x: event.clientX - reactFlowBounds.left,
            y: event.clientY - reactFlowBounds.top,
        });

        console.assert(druggedNode !== null, 'drugged node should not be assigned before dragging'); 
        if (druggedNode !== null)
            atlasGraph.nodes.push(druggedNode.setPosition(pos.x, pos.y).setDefaultName());
        webInterfaceUtils.refreshElements();
    };

    useEffect(() => {
        webInterfaceUtils.refreshElements();
    }, [selectedNode, setElements]);

    useEffect(() => {
        if (selectedNode === null) (mathInputRef.current as MathInput).hide();
    }, [selectedNode]);

    return (
            <ReactFlowProvider>
                <div className={styles.flowcanvas} ref={reactFlowWrapper}>
                    <ReactFlow
                        // id={styles.blocks_canvas}
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
                        {/*<MiniMap />*/}
                        {/*<Controls />*/}
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
