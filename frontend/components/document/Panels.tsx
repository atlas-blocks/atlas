import { useEffect, useState } from 'react';
import styles from '../../styles/main.module.css';
import buttonStyles from '../../styles/BtnStyle.module.css';
import WebInterfaceUtils from '../../utils/WebInterfaceUtils';
import ElementsPanel from './ElementsPanel';
import PropsPanel from './PropsPanel';
import LibPanel from './LibPanel';

type Props = {
	wiu: WebInterfaceUtils;
};

export default function Panels({ wiu }: Props) {
	const [isLibrariessActive, setIsLibrariesActive] = useState<boolean>(true);
	const [isPropertiesActive, setIsPropertiesActive] = useState<boolean>(true);

	const hideAll = () => {
		setIsLibrariesActive(false);
		setIsPropertiesActive(false);
	};
	const showLibraries = () => {
		hideAll();
		setIsLibrariesActive(true);
	};
	const showProperties = () => {
		hideAll();
		setIsPropertiesActive(true);
	};

	const getButtonClass = (isActive: boolean): string => {
		return buttonStyles.generalBtn + ' ' + (isActive ? buttonStyles.actBtn : '');
	};
	const getPanelClass = (isActive: boolean): string => {
		return isActive ? '' : styles.panelHidden;
	};

	useEffect(() => {
		wiu.selectedNode ? showProperties() : showLibraries();
	}, [wiu.selectedNode]);

	return (
		<>
			{/* ------- Buttons ------- */}
			<div
				id={buttonStyles.libBtn}
				className={getButtonClass(isLibrariessActive)}
				onClick={showLibraries}
			>
				<label>Libraries</label>
			</div>
			<div id={buttonStyles.assetsBtn} className={getButtonClass(false)}>
				<label>Assets</label>
			</div>
			<div
				id={buttonStyles.propBtn}
				className={getButtonClass(isPropertiesActive)}
				onClick={showProperties}
			>
				<label>Properties</label>
			</div>
			<div id={buttonStyles.objBtn} className={getButtonClass(false)}>
				<label>Object</label>
			</div>
			<div id={buttonStyles.mockupBtn} className={getButtonClass(false)}>
				<label>Mockup</label>
			</div>
			<div id={buttonStyles.envBtn} className={getButtonClass(false)}>
				<label>Environment</label>
			</div>
			<div id={buttonStyles.elementsBtn} className={getButtonClass(true)}>
				<label>Elements</label>
			</div>
			<div id={buttonStyles.layersBtn} className={getButtonClass(false)}>
				<label>Layers</label>
			</div>

			{/* ------- Panels ------- */}
			<section id={styles.elementsPanel} className={styles.elementsPanel}>
				<ElementsPanel wiu={wiu} />
			</section>
			<section id={styles.propsPanel} className={getPanelClass(isPropertiesActive)}>
				<PropsPanel wiu={wiu} />
			</section>
			<section id={styles.libPanel} className={getPanelClass(isLibrariessActive)}>
				<LibPanel wiu={wiu} />
			</section>
		</>
	);
}
