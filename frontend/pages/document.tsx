import React, { useState } from 'react';
import Head from 'next/head';

import Navbar from '../components/document/Navbar';
import UiAtlasWindow from '../components/document/UiAtlasWindow';
import Panels from '../components/document/Panels';
import { exampleNodes } from '../components/blocks/ExampleNodes';

import AtlasGraph from '../src/graph/AtlasGraph';
import AtlasNode from '../src/graph/nodes/AtlasNode';
import JuliaExecuter from '../src/kernels/JuliaExecuter';
import { atlasModule } from '../src/utils/AtlasModule';
import WebInterfaceUtils, { wiu } from '../src/utils/WebInterfaceUtils';
import { awu } from '../src/utils/AtlasWindowUtils';

import AtlasGrpahFlow from '../src/flows/AtlasGraphFlow';
import JupyterFlow from '../src/flows/JupyterFlow';

import styles from '../styles/main.module.css';

wiu.graph = new AtlasGraph();
atlasModule.graph = wiu.graph;
atlasModule.wiu = wiu;
exampleNodes.forEach((node) => wiu.graph.nodes.push(node));

awu.clearFlows();
awu.addFlow(new AtlasGrpahFlow(wiu.graph));
awu.addFlow(new JupyterFlow());

if (global.window) {
	atlasModule.executer = new JuliaExecuter();
}

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
				<UiAtlasWindow />
				<Panels />
			</div>
		</>
	);
}
