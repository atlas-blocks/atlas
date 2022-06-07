import { useEffect, useState } from 'react';
import styles from '../../styles/main.module.css';
import btnStyles from '../../styles/BtnStyle.module.css';
import WebInterfaceUtils from '../../utils/WebInterfaceUtils';
import ElementsPanel from './ElementsPanel';
import PropsPanel from './PropsPanel';
import LibPanel from './LibPanel';

type Props = {
	wiu: WebInterfaceUtils;
};

export default function Panels({ wiu }: Props) {
	const [libBtnState, setLibBtnState] = useState(
		`${btnStyles.generalBtn} ${btnStyles.libBtn} ${btnStyles.actBtn}`,
	);
	const [propBtnState, setPropBtnState] = useState(
		`${btnStyles.generalBtn} ${btnStyles.propBtn}`,
	);
	const [propsPanelState, setPropsPanelState] = useState(
		`${styles.propsPanel} ${styles.panelHidden}`,
	);
	const [libPanelState, setLibPanelState] = useState(`${styles.libPanel}`);

	const showLibraries = () => {
		setLibBtnState(`${btnStyles.generalBtn} ${btnStyles.libBtn} ${btnStyles.actBtn}`);
		setPropBtnState(`${btnStyles.generalBtn} ${btnStyles.propBtn}`);
		setPropsPanelState(`${styles.propsPanel} ${styles.panelHidden}`);
		setLibPanelState(`${styles.libPanel}`);
	};
	const showProperties = () => {
		setPropBtnState(`${btnStyles.generalBtn} ${btnStyles.propBtn} ${btnStyles.actBtn}`);
		setLibBtnState(`${btnStyles.generalBtn} ${btnStyles.libBtn}`);
		setLibPanelState(`${styles.libPanel} ${styles.panelHidden}`);
		setPropsPanelState(`${styles.propsPanel}`);
	};

	useEffect(() => {
		wiu.selectedNode ? showProperties() : showLibraries();
	}, [wiu.selectedNode]);
	return (
		<>
			{/* ------- Buttons ------- */}
			<div className={libBtnState} onClick={showLibraries}>
				<label>Libraries</label>
			</div>
			<div className={`${btnStyles.generalBtn} ${btnStyles.assetsBtn}`}>
				<label>Assets</label>
			</div>
			<div className={propBtnState} onClick={showProperties}>
				<label>Properties</label>
			</div>
			<div className={`${btnStyles.generalBtn} ${btnStyles.objBtn}`}>
				<label>Object</label>
			</div>
			<div className={`${btnStyles.generalBtn} ${btnStyles.mockupBtn}`}>
				<label>Mockup</label>
			</div>
			<div className={`${btnStyles.generalBtn} ${btnStyles.envBtn}`}>
				<label>Environment</label>
			</div>
			<div className={`${btnStyles.generalBtn} ${btnStyles.elementsBtn} ${btnStyles.actBtn}`}>
				<label>Elements</label>
			</div>
			<div className={`${btnStyles.generalBtn} ${btnStyles.layersBtn}`}>
				<label>Layers</label>
			</div>

			{/* ------- Panels ------- */}
			<section className={styles.elementsPanel}>
				<ElementsPanel wiu={wiu} />
			</section>
			<PropsPanel propPanelStyleWrapper={propsPanelState} wiu={wiu} />
			<LibPanel wiu={wiu} libPanelStyleWrapper={libPanelState} />
		</>
	);
}
