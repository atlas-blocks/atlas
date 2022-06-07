import { useState } from 'react';

import WebInterfaceUtils from '../utils/WebInterfaceUtils';
import DnDFlow, { atlasGraph } from '../components/document/DnDFlow';
import Panels from '../components/document/Panels';
import { AtlasNode } from '../utils/AtlasGraph';
import styles from '../styles/main.module.css';
import Head from 'next/head';
import Image from 'next/image';
import menuImg from '../public/icons/menu.png';
import questionImg from '../public/icons/question.png';
import settingsImg from '../public/icons/settings.png';
import exportImg from '../public/icons/export.png';
import logoImg from '../public/logo/atlas_long_white_cut.png';

export default function Home() {
	const [druggedNode, setDruggedNode] = useState<AtlasNode | null>(null);
	const [selectedNode, setSelectedNode] = useState<AtlasNode | null>(null);
	const [uiNodes, setUiNodes] = useState(WebInterfaceUtils.getUiNodes(atlasGraph));
	const [uiEdges, setUiEdges] = useState(WebInterfaceUtils.getUiEdges(atlasGraph));
	const wiu = new WebInterfaceUtils(
		atlasGraph,
		selectedNode,
		setUiNodes,
		setUiEdges,
		setSelectedNode,
		setDruggedNode,
	);

	return (
		<>
			<Head>
				<title>Atlas Next</title>
			</Head>
			<div className={styles.layout}>
				<div className={styles.leftTop}>
					<Image
						src={menuImg}
						width={'20px'}
						height={'20px'}
						layout={'intrinsic'}
						objectFit={'contain'}
					/>
					<Image
						src={logoImg}
						alt="Atlas Logo"
						width={'100%'}
						height={'100%'}
						layout={'intrinsic'}
						objectFit={'contain'}
					/>
				</div>
				<div className={styles.centerTop}>
					<a>\mockup_name1</a>
				</div>
				<div className={styles.rightTop}>
					<Image
						src={exportImg}
						width={'20px'}
						height={'20px'}
						layout={'intrinsic'}
						objectFit={'contain'}
					/>
					<Image
						src={questionImg}
						width={'10px'}
						height={'100%'}
						layout={'intrinsic'}
						objectFit={'contain'}
					/>
					<Image
						src={settingsImg}
						width={'20px'}
						height={'20px'}
						layout={'intrinsic'}
						objectFit={'contain'}
					/>
				</div>

				<DnDFlow wiu={wiu} druggedNode={druggedNode} />
				<Panels wiu={wiu} />
			</div>
		</>
	);
}
