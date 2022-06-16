import { useState } from 'react';
import Head from 'next/head';

import Navbar from '../components/document/Navbar';
import DnDFlow from '../components/document/DnDFlow';
import Panels from '../components/document/Panels';

import WebInterfaceUtils from '../utils/WebInterfaceUtils';
import AtlasGraph, { AtlasNode } from '../utils/AtlasGraph';
import styles from '../styles/main.module.css';
import { exampleNodes } from '../components/blocks/ExampleNodes';

export const atlasGraph = new AtlasGraph();
exampleNodes.forEach((node) => atlasGraph.nodes.push(node));
atlasGraph.name = 'atlas_schema';

export default function Home() {
	const [druggedNode, setDruggedNode] = useState<AtlasNode | null>(null);
	const [selectedNode, setSelectedNode] = useState<AtlasNode | null>(null);
	const [selectedOption, setSelectedOption] = useState<number | null>(null);
	const [uiNodes, setUiNodes] = useState(WebInterfaceUtils.getUiNodes(atlasGraph));
	const [uiEdges, setUiEdges] = useState(WebInterfaceUtils.getUiEdges(atlasGraph));
	const wiu = new WebInterfaceUtils(
		atlasGraph,
		uiNodes,
		uiEdges,
		setUiNodes,
		setUiEdges,
		selectedNode,
		setSelectedNode,
		druggedNode,
		setDruggedNode,
		selectedOption,
		setSelectedOption,
	);

	return (
		<>
			<Head>
				<title>Atlas Next</title>
			</Head>
			<div className={styles.layout}>
				<Navbar wiu={wiu} />
				<DnDFlow wiu={wiu} />
				<Panels wiu={wiu} />
			</div>
		</>
	);
}
