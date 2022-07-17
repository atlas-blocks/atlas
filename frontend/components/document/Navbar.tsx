import Image from 'next/image';
import React, { ChangeEvent, useEffect, useRef, useState } from 'react';
import { wiu } from '../../src/utils/WebInterfaceUtils';
import { atlasModule } from '../../src/utils/AtlasModule';
import styles from '../../styles/Navbar.module.css';
import menuImg from '../../public/icons/menu.png';
import logoImg from '../../public/logo/atlas_long_white_cut.png';
import exportImg from '../../public/icons/export.png';
import questionImg from '../../public/icons/question-mark.png';
import personImg from '../../public/icons/person.png';
import AtlasGraph from '../../src/graph/AtlasGraph';
import StorageUtils from '../../src/utils/StorageUtils';
import JsonUtils from '../../src/utils/JsonUtils';
import FileUtils from '../../src/utils/FileUtils';

function hasAncestorWithClass(element: HTMLElement | null, className: string): boolean {
	while (element && !element.classList.contains(className)) {
		element = element.parentElement;
	}
	return element !== null;
}

export default function Navbar() {
	const refSchemaName = useRef<HTMLInputElement>(null);
	const refOpenFile = useRef<HTMLInputElement>(null);
	const [isFileMenuOpen, setIsFileMenuOpen] = useState<boolean>(false);
	const [recentFromLocalStorage, setRecentFromLocalStorage] = useState<AtlasGraph[]>();
	const [removeTrigger, setRemoveTrigger] = useState<boolean>(false);

	const fileMenuStyle = styles.fileMenu + (isFileMenuOpen ? '' : ' ' + styles.fileMenuHidden);
	const fileMenuPartClass = 'fileMenuPartClass';

	const downloadFile = () => FileUtils.makeUserDownloadFileFromGraph(wiu.graph, 'ca');
	const exportFile = () => FileUtils.makeUserDownloadFileFromGraph(wiu.graph, 'json');
	const handleNewSchema = (): void => {
		const newGraph = new AtlasGraph();
		newGraph.name = wiu.graph.name + '_new';
		atlasModule.replaceGraphWithNew(newGraph);
	};
	const handleOpenFile = (event: ChangeEvent<HTMLInputElement>) => {
		if (event.target.files === null) return;
		const filepath = event.target.files[0];
		FileUtils.getFileContentString(filepath, (content: string) =>
			atlasModule.replaceGraphWithNew(JsonUtils.jsonStringToGraph(content)),
		);
	};
	const removeGraphFromRecent = (evt: React.MouseEvent<HTMLDivElement>): void => {
		evt.stopPropagation();
		StorageUtils.removeGraphFromStorage(evt.currentTarget.id);
		setRemoveTrigger(!removeTrigger);
	};
	const updateRecentElementsUi = () => {
		setRecentFromLocalStorage(StorageUtils.getRecentGraphsFromLocalStorage().reverse());
		refSchemaName.current!.value = wiu.graph.name;
	};
	useEffect(updateRecentElementsUi, [wiu.graph.name, removeTrigger]);

	const handleClick = (event: MouseEvent) => {
		if (!isFileMenuOpen) return;
		setIsFileMenuOpen(hasAncestorWithClass(event.target as HTMLElement, fileMenuPartClass));
	};

	useEffect(() => {
		document.addEventListener('click', handleClick);
		return () => document.removeEventListener('click', handleClick);
	});

	function getRecentGraphElement(graphFromRecentList: AtlasGraph): JSX.Element {
		if (graphFromRecentList.name === wiu.graph.name) {
			return <div key={graphFromRecentList.name}></div>;
		}
		return (
			<div
				key={graphFromRecentList.name}
				className={styles.elementFileMenu}
				onClick={() => atlasModule.replaceGraphWithNew(graphFromRecentList)}
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
					<Image src={menuImg} objectFit={'contain'} alt={'menuImg'} />
				</div>
				<Image
					src={logoImg}
					alt="Atlas Logo"
					width={'100%'}
					height={'100%'}
					objectFit={'contain'}
				/>
			</div>
			<div className={styles.centerTop}>
				<input
					className={styles.inputFileName}
					ref={refSchemaName}
					defaultValue={wiu.graph.name}
					onChange={() => wiu.graph.setName(refSchemaName.current!.value)}
				/>
				<div
					className={styles.iconSmall + ' ' + fileMenuPartClass}
					onClick={() => setIsFileMenuOpen(!isFileMenuOpen)}
				>
					<Image
						src={menuImg}
						layout={'responsive'}
						objectFit={'contain'}
						alt={'menuImg'}
					/>
				</div>
				<div className={fileMenuStyle + ' ' + fileMenuPartClass}>
					<div className={styles.elementFileMenu} onClick={handleNewSchema}>
						<label>New</label>
					</div>
					<div
						className={styles.elementFileMenu}
						onClick={() => refOpenFile.current?.click()}
					>
						<label>Open...</label>
					</div>
					<div className={styles.elementFileMenu} onClick={downloadFile}>
						<label>Download</label>
					</div>
					<div className={styles.elementFileMenu}>
						<label className={styles.recent}>Recent</label>
					</div>
					<div>
						{recentFromLocalStorage?.map((graph) => getRecentGraphElement(graph))}
					</div>
				</div>
			</div>
			<div className={styles.rightTop}>
				<div className={styles.icon} onClick={exportFile}>
					<Image src={exportImg} objectFit={'contain'} alt="exportImg" />
				</div>
				<div className={styles.icon}>
					<a target={'_blank'} href={'https://docs.ca.engineering'} rel="noreferrer">
						<Image src={questionImg} objectFit={'contain'} alt={'questionImg'} />
					</a>
				</div>
				<div className={styles.icon}>
					<Image src={personImg} objectFit={'contain'} alt={'personImg'} />
				</div>
				<input
					type={'file'}
					ref={refOpenFile}
					style={{ display: 'none' }}
					onChange={handleOpenFile}
				/>
			</div>
		</>
	);
}
