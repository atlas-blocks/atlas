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

type Props = {
	wiu: WebInterfaceUtils;
};

export default function Navbar({ wiu }: Props) {
	const refSchemaName = useRef<HTMLInputElement>(null);
	const refOpenFile = useRef<HTMLInputElement>(null);
	const [isFileMenuOpen, setIsFileMenuOpen] = useState<boolean>(false);
	const [recentFromLocalStorage, setRecentFromLocalStorage] = useState<string | null>();
	const fileMenuStyle = isFileMenuOpen
		? styles.fileMenu
		: styles.fileMenu + ' ' + styles.fileMenuHidden;

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
					wiu.loadGraphToUi(evt.target.result);
				}
			};
		}
	};

	const handleNewSchema = () => {
		wiu.loadGraphToUi(`{"name": "${wiu.graph.name}_new", "nodes": [], "edges": []}`);
	};

	const removeRecent = (evt: React.MouseEvent<HTMLDivElement>) => {
		evt.stopPropagation();
		wiu.removeGraphFromStorage(parseInt(evt.currentTarget.id));
		setRecentFromLocalStorage(localStorage.getItem('AtlasStorage'));
	};

	useEffect(() => {
		setIsFileMenuOpen(false);
		refSchemaName.current!.value = wiu.graph.name;
		setRecentFromLocalStorage(localStorage.getItem('AtlasStorage'));
	}, [wiu.graph.name]);

	function getRecentGraphs(graphFromLS: AtlasGraph, index: number): JSX.Element {
		return (
			<div
				key={index}
				className={styles.elementFileMenu}
				onClick={() => wiu.loadGraphToUi(JSON.stringify(graphFromLS))}
			>
				<label className={styles.recentGraphName}>{'-- ' + graphFromLS.name}</label>
				<div
					id={index.toString()}
					className={styles.remove}
					onClick={(evt: React.MouseEvent<HTMLDivElement>) => removeRecent(evt)}
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
					<div>
						{recentFromLocalStorage
							? JSON.parse(recentFromLocalStorage).map(
									(graph: AtlasGraph, index: number) =>
										getRecentGraphs(graph, index),
							  )
							: ''}
					</div>
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
