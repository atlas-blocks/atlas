import Image from 'next/image';
import { useRef, useState } from 'react';
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

	const getCurrentFilename = (extension: string) => {
		return refSchemaName.current
			? refSchemaName.current.value + extension
			: 'atlas_schema' + extension;
	};

	const exportToFile = (extension: string) => {
		setIsFileMenuOpen(false);

		const graphJson = JSON.stringify(wiu.graph, null, 2);
		const blob = new Blob([graphJson], { type: 'application/json' });
		const href = URL.createObjectURL(blob);
		const link = document.createElement('a');
		link.href = href;
		link.download = getCurrentFilename(extension);
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
	};

	const loadNewGraph = (fileData: string) => {
		const newGraph = ServerUtils.jsonToGraph(JSON.parse(fileData));
		wiu.graph.nodes = newGraph.nodes;
		wiu.graph.edges = newGraph.edges;
		wiu.refreshUiElements();
	};

	const handleOpenFile = () => {
		setIsFileMenuOpen(false);

		if (refOpenFile.current?.files) {
			let jsonFile = new FileReader();
			jsonFile.readAsText(refOpenFile.current.files[0]);
			jsonFile.onload = (evt: ProgressEvent<FileReader>) => {
				if (typeof evt.target?.result === 'string') loadNewGraph(evt.target.result);
			};
		}
	};

	const handleNewSchema = () => {
		setIsFileMenuOpen(false);

		wiu.graph.nodes = [];
		wiu.graph.edges = [];
		wiu.refreshUiElements();
	};

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
					defaultValue={'atlas_schema_1'}
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
						New
					</div>
					<div className={styles.elementFileMenu}>Recent</div>
					<div
						className={styles.elementFileMenu}
						onClick={() => refOpenFile.current?.click()}
					>
						Open...
					</div>
					<div className={styles.elementFileMenu} onClick={() => exportToFile('.ca')}>
						Download
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
					onChange={handleOpenFile}
				/>
			</div>
		</>
	);
}
