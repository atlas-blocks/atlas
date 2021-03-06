import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

import styles from '../../styles/main.module.css';
import buttonStyles from '../../styles/BtnStyle.module.css';
import { wiu } from '../../src/utils/WebInterfaceUtils';
import ElementsPanel from './ElementsPanel';
import PropsPanel from './PropsPanel';
import LibPanel from './LibPanel';

import { panels as panels_en } from '../../locales/en';
import { panels as panels_ru } from '../../locales/ru';

export default function Panels(): JSX.Element {
	const router = useRouter();
	const { locale } = router;
	const t = locale === 'en' ? panels_en : panels_ru;

	const [isLibrariesActive, setIsLibrariesActive] = useState<boolean>(true);
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
				className={getButtonClass(isLibrariesActive)}
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
				<label>{t.mockup}</label>
			</div>
			<div id={buttonStyles.envBtn} className={getButtonClass(false)}>
				<label>Environment</label>
			</div>
			<div id={buttonStyles.elementsBtn} className={getButtonClass(true)}>
				<label>{t.elements}</label>
			</div>
			<div id={buttonStyles.layersBtn} className={getButtonClass(false)}>
				<label>Layers</label>
			</div>

			{/* ------- Panels ------- */}
			<section id={styles.elementsPanel}>
				<ElementsPanel />
			</section>
			<section id={styles.propsPanel} className={getPanelClass(isPropertiesActive)}>
				<PropsPanel />
			</section>
			<section id={styles.libPanel} className={getPanelClass(isLibrariesActive)}>
				<LibPanel />
			</section>
		</>
	);
}
