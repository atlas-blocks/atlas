import React, { useState } from 'react';
import Head from 'next/head';

import Navbar from '../components/document/Navbar';
import DnDFlow from '../components/document/DnDFlow';
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
exampleNodes.forEach((node) => wiu.graph.nodes.push(node));
wiu.graph.name = 'atlas_schema';

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
				<DnDFlow />
				<Panels />
				<JupyterNotebook />
			</div>
		</>
	);
}
