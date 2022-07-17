import React, { useState } from 'react';
import Head from 'next/head';

import Navbar from '../components/document/Navbar';
import TabsSection from '../components/document/TabsSection';
import Panels from '../components/document/Panels';
import JupyterNotebook from '../components/document/JupyterNotebook';

import WebInterfaceUtils, { wiu } from '../src/utils/WebInterfaceUtils';
import { atlasModule } from '../src/utils/AtlasModule';
import AtlasNode from '../src/graph/nodes/AtlasNode';
import AtlasGraph from '../src/graph/AtlasGraph';
import styles from '../styles/main.module.css';
import { exampleNodes } from '../components/blocks/ExampleNodes';
import JuliaExecuter from '../src/kernels/JuliaExecuter';

wiu.graph = new AtlasGraph();
atlasModule.graph = wiu.graph;
atlasModule.executer = new JuliaExecuter();
atlasModule.wiu = wiu;
exampleNodes.forEach((node) => wiu.graph.nodes.push(node));

export default function Home() {
	[wiu.druggedNode, wiu.setDruggedNode] = useState<AtlasNode | null>(null);
	[wiu.selectedNode, wiu.setSelectedNode] = useState<AtlasNode | null>(null);
	[wiu.uiNodes, wiu.setUiNodes] = useState(WebInterfaceUtils.getUiNodes(wiu.graph));
	[wiu.uiEdges, wiu.setUiEdges] = useState(WebInterfaceUtils.getUiEdges(wiu.graph));

	return (
		<>
			<Head>
				<title>Atlas Next</title>
			</Head>
			<div className={styles.layout}>
				<Navbar />
				<TabsSection />
				<Panels />
			</div>
		</>
	);
}
