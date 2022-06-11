import Image from 'next/image';
import { ChangeEvent, useEffect, useRef, useState } from 'react';
import WebInterfaceUtils from '../../utils/WebInterfaceUtils';
import styles from '../../styles/Navbar.module.css';
import menuImg from '../../public/icons/menu.png';
import logoImg from '../../public/logo/atlas_long_white_cut.png';
import exportImg from '../../public/icons/export.png';
import questionImg from '../../public/icons/question-mark.png';
import settingsImg from '../../public/icons/settings.png';
import AtlasGraph from '../../utils/AtlasGraph';
import StorageUtils from '../../utils/StorageUtils';
import JsonUtils from '../../utils/JsonUtils';

type Props = {
	wiu: WebInterfaceUtils;
};

export default function Navbar({ wiu }: Props) {
	const refSchemaName = useRef<HTMLInputElement>(null);
	const refOpenFile = useRef<HTMLInputElement>(null);
	const [isFileMenuOpen, setIsFileMenuOpen] = useState<boolean>(false);
	const [recentFromLocalStorage, setRecentFromLocalStorage] = useState<AtlasGraph[]>();
	const [removeTrigger, setRemoveTrigger] = useState<boolean>(false);
	const fileMenuStyle = styles.fileMenu + (isFileMenuOpen ? '' : ' ' + styles.fileMenuHidden);

	const exportToFile = (extension: string) => {
		setIsFileMenuOpen(false);

		const graphJson = JSON.stringify(wiu.graph, null, 2);
		const blob = new Blob([graphJson], { type: 'application/json' });
		const href = URL.createObjectURL(blob);
		const link = document.createElement('a');
		link.href = href;
		link.download = wiu.graph.name + extension;
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
	};

	const handleOpenFile = (fileToLoad: File | null) => {
		if (fileToLoad) {
			let jsonFile = new FileReader();
			jsonFile.readAsText(fileToLoad);
			jsonFile.onload = (evt: ProgressEvent<FileReader>) => {
				if (typeof evt.target?.result === 'string') {
					wiu.loadGraphToUi(JsonUtils.jsonStringToGraph(evt.target.result));
				}
			};
		}
	};

	const handleNewSchema = () => {
		const newGraph = new AtlasGraph();
		newGraph.name = wiu.graph.name + '_new';
		wiu.loadGraphToUi(newGraph);
	};

	const removeGraphFromRecent = (evt: React.MouseEvent<HTMLDivElement>) => {
		evt.stopPropagation();
		StorageUtils.removeGraphFromStorage(evt.currentTarget.id);
		setRemoveTrigger(!removeTrigger);
	};

	useEffect(() => {
		const strFromStorage: string | null = localStorage.getItem('AtlasStorage');
		const atlasStorage: AtlasGraph[] = [];

		if (strFromStorage) {
			JSON.parse(strFromStorage).map((item: AtlasGraph) =>
				atlasStorage.push(JsonUtils.jsonToGraph(item)),
			);
		}
		setRecentFromLocalStorage(atlasStorage.reverse());
		setIsFileMenuOpen(false);
		refSchemaName.current!.value = wiu.graph.name;
	}, [removeTrigger, wiu.graph.name]);

	function getRecentGraphs(graphFromRecentList: AtlasGraph): JSX.Element {
		if (graphFromRecentList.name === wiu.graph.name)
			return <div key={graphFromRecentList.name}></div>;
		return (
			<div
				key={graphFromRecentList.name}
				className={styles.elementFileMenu}
				onClick={() => wiu.loadGraphToUi(graphFromRecentList)}
			>
				<label className={styles.recentGraphName}>{'> ' + graphFromRecentList.name}</label>
				<div
					id={graphFromRecentList.name}
					className={styles.remove}
					onClick={removeGraphFromRecent}
				>
					<label>remove</label>
				</div>
			</div>
		);
	}

	return (
		<>
			<div className={styles.leftTop}>
				<div className={styles.icon}>
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
					defaultValue={wiu.graph.name}
					onChange={() => (wiu.graph.name = refSchemaName.current!.value)}
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
						<label className={styles.recent}>Recent</label>
					</div>
					<div>{recentFromLocalStorage?.map((graph) => getRecentGraphs(graph))}</div>
				</div>
			</div>
			<div className={styles.rightTop}>
				<div className={styles.icon}>
					<Image
						src={exportImg}
						layout={'responsive'}
						objectFit={'contain'}
						onClick={() => exportToFile('.json')}
					/>
				</div>
				<div className={styles.icon}>
					<Image src={questionImg} layout={'responsive'} objectFit={'contain'} />
				</div>
				<div className={styles.icon}>
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
