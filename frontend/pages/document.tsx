import { useRef, useState } from 'react';

import WebInterfaceUtils from '../utils/WebInterfaceUtils';
import DnDFlow, { atlasGraph } from '../components/document/DnDFlow';
import Panels from '../components/document/Panels';
import { AtlasNode } from '../utils/AtlasGraph';
import styles from '../styles/main.module.css';
import Head from 'next/head';
import Image from 'next/image';
import menuImg from '../public/icons/menu.png';
import questionImg from '../public/icons/question-mark.png';
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
		setUiNodes,
		setUiEdges,
		selectedNode,
		setSelectedNode,
		druggedNode,
		setDruggedNode,
	);
	const refSchemaName = useRef<HTMLInputElement>(null);

	const exportToFile = () => {
		let fileName = '';

		refSchemaName.current
			? (fileName = refSchemaName.current.value)
			: (fileName = 'atlas_schema.ca');

		const graphJson = JSON.stringify(wiu.graph, null, 2);
		const blob = new Blob([graphJson], { type: 'application/json' });
		const href = URL.createObjectURL(blob);
		const link = document.createElement('a');
		link.href = href;
		link.download = fileName;
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
	};

	const [dropFileChoice, setDropFileChoice] = useState<string>();
	const onDropChange = (evt: React.ChangeEvent<HTMLSelectElement>) => {
		setDropFileChoice(evt.target.value);
	};

	return (
		<>
			<Head>
				<title>Atlas Next</title>
			</Head>
			<div className={styles.layout}>
				<div className={styles.leftTop}>
					<div>
						<div className={styles.iconStyle}>
							<Image src={menuImg} layout={'responsive'} objectFit={'contain'} />
						</div>
					</div>
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
					<input
						className={styles.inputFileName}
						ref={refSchemaName}
						defaultValue={'atlas_schema.ca'}
					/>
					{/*</input>*/}
					{/*<select*/}
					{/*	value={dropFileChoice}*/}
					{/*	className={styles.dropFileName}*/}
					{/*	onChange={onDropChange}*/}
					{/*	placeholder={'adsfadfs'}*/}
					{/*>*/}
					{/*	<option selected disabled hidden>*/}
					{/*		/!*<input defaultValue={'asdf'} />*!/*/}
					{/*	</option>*/}
					{/*	<option value={'open'}>Open</option>*/}
					{/*	<option value={'save'}>Save</option>*/}
					{/*</select>*/}
				</div>
				<div className={styles.rightTop}>
					<div className={styles.iconStyle}>
						<Image
							src={exportImg}
							layout={'responsive'}
							objectFit={'contain'}
							onClick={exportToFile}
						/>
						{/*<input type="hidden" name="city" list="cityname" />*/}
						{/*<datalist id="cityname">*/}
						{/*	<option value="Boston" />*/}
						{/*	<option value="Cambridge" />*/}
						{/*</datalist>*/}
					</div>
					<div className={styles.iconStyle}>
						<Image src={questionImg} layout={'responsive'} objectFit={'contain'} />
					</div>
					<div className={styles.iconStyle}>
						<Image src={settingsImg} layout={'responsive'} objectFit={'contain'} />
					</div>
				</div>

				<DnDFlow wiu={wiu} />
				<Panels wiu={wiu} />
			</div>
		</>
	);
}
