import Image from 'next/image';
import { ChangeEvent, useEffect, useRef, useState } from 'react';
import WebInterfaceUtils from '../../utils/WebInterfaceUtils';
import styles from '../../styles/main.module.css';
import menuImg from '../../public/icons/menu.png';
import logoImg from '../../public/logo/atlas_long_white_cut.png';
import exportImg from '../../public/icons/export.png';
import questionImg from '../../public/icons/question-mark.png';
import settingsImg from '../../public/icons/settings.png';
import ServerUtils from '../../utils/ServerUtils';

type Props = {
	wiu: WebInterfaceUtils;
};

export default function Navbar({ wiu }: Props) {
	const refSchemaName = useRef<HTMLInputElement>(null);
	const refOpenFile = useRef<HTMLInputElement>(null);
	const [isFileMenuOpen, setIsFileMenuOpen] = useState<boolean>(false);
	const fileMenuStyle = isFileMenuOpen
		? styles.fileMenu
		: styles.fileMenu + ' ' + styles.fileMenuHidden;

	const changeGraphName = (newName: string) => wiu.setGraphName(newName);

	const exportToFile = (extension: string) => {
		setIsFileMenuOpen(false);

		const graphJson = JSON.stringify(wiu.graph, null, 2);
		const blob = new Blob([graphJson], { type: 'application/json' });
		const href = URL.createObjectURL(blob);
		const link = document.createElement('a');
		link.href = href;
		link.download = wiu.graphName + extension;
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
	};

	const [cacheLocalStorage, setCacheLocalStorage] = useState<Storage>();

	const loadNewGraph = (newGraphName: string, fileData: string | null) => {
		setIsFileMenuOpen(false);
		if (!fileData) return;
		try {
			const newGraph = ServerUtils.jsonToGraph(JSON.parse(fileData));
			wiu.graph.nodes = newGraph.nodes;
			wiu.graph.edges = newGraph.edges;
			wiu.setSelectedNode(null);
			wiu.refreshUiElements();

			refSchemaName.current!.value = newGraphName;
			changeGraphName(newGraphName);
		} catch (e) {
			console.log(e);
		}
	};

	const handleOpenFile = (fileToLoad: File | null) => {
		if (fileToLoad) {
			let jsonFile = new FileReader();
			jsonFile.readAsText(fileToLoad);
			jsonFile.onload = (evt: ProgressEvent<FileReader>) =>
				typeof evt.target?.result === 'string'
					? loadNewGraph(fileToLoad.name, evt.target.result)
					: null;
		}
	};

	const handleNewSchema = () => {
		loadNewGraph(wiu.graphName + '_new', '{"nodes": [], "edges": []}');
	};

	useEffect(() => {
		setCacheLocalStorage(localStorage);
	}, []);

	function getRecentGraphs(graphName: string, graphFromLS: string | null): JSX.Element {
		return (
			<div
				className={styles.elementFileMenu}
				onClick={() => (graphFromLS ? loadNewGraph(graphName, graphFromLS) : null)}
			>
				<label>{graphName}</label>
			</div>
		);
	}

	return (
		<>
			<div className={styles.leftTop}>
				<div className={styles.iconStyle}>
					<Image src={menuImg} layout={'responsive'} objectFit={'contain'} />
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
					defaultValue={wiu.graphName}
					onChange={() => changeGraphName(refSchemaName.current!.value)}
				/>
				<div className={styles.iconSmall}>
					<Image
						src={menuImg}
						layout={'responsive'}
						objectFit={'contain'}
						onClick={() => setIsFileMenuOpen(!isFileMenuOpen)}
					/>
				</div>
				<div className={fileMenuStyle}>
					<div className={styles.elementFileMenu} onClick={handleNewSchema}>
						<label>New</label>
					</div>
					<div
						className={styles.elementFileMenu}
						onClick={() => refOpenFile.current?.click()}
					>
						<label>Open...</label>
					</div>
					<div className={styles.elementFileMenu} onClick={() => exportToFile('.ca')}>
						<label>Download</label>
					</div>
					<div className={styles.elementFileMenu}>
						<label>Recent</label>
					</div>
					<div>
						{cacheLocalStorage
							? Object.keys(cacheLocalStorage).map((key) =>
									getRecentGraphs(key, cacheLocalStorage.getItem(key)),
							  )
							: ''}
					</div>
				</div>
			</div>
			<div className={styles.rightTop}>
				<div className={styles.iconStyle}>
					<Image
						src={exportImg}
						layout={'responsive'}
						objectFit={'contain'}
						onClick={() => exportToFile('.json')}
					/>
				</div>
				<div className={styles.iconStyle}>
					<Image src={questionImg} layout={'responsive'} objectFit={'contain'} />
				</div>
				<div className={styles.iconStyle}>
					<Image src={settingsImg} layout={'responsive'} objectFit={'contain'} />
				</div>
				<input
					type={'file'}
					ref={refOpenFile}
					style={{ display: 'none' }}
					onChange={(evt: ChangeEvent<HTMLInputElement>) =>
						handleOpenFile(evt.target.files ? evt.target.files[0] : null)
					}
				/>
			</div>
		</>
	);
}
