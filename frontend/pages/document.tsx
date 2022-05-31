import DnDFlow, {atlasGraph} from '../components/document/DnDFlow';
import Head from 'next/head';
import styles from '../styles/main.module.css';
import btnStyles from '../styles/BtnStyle.module.css';
import ElementsPanel from '../components/document/ElementsPanel';
import PropsPanel from '../components/document/PropsPanel';
import LibPanel from '../components/document/LibPanel';
import {useEffect, useState} from 'react';
import Image from 'next/image';
import menuImg from '/img/icons/menu.png';
import questionImg from '/img/icons/question.png';
import settingsImg from '/img/icons/settings.png';
import exportImg from '/img/icons/export.png';
import logoImg from '/img/logo/atlas_long_white_cut.png';
import WebInterfaceUtils from '../utils/WebInterfaceUtils';
import {AtlasNode} from "../utils/AtlasGraph";


export default function Home() {
    const [libBtnState, setLibBtnState] = useState(
        `${btnStyles.justBtn} ${btnStyles.libBtn} ${btnStyles.actBtn}`,
    );
    const [propBtnState, setPropBtnState] = useState(`${btnStyles.justBtn} ${btnStyles.propBtn}`);
    const [propsPanelState, setPropsPanelState] = useState(
        `${styles.propsPanel} ${styles.panelHidden}`,
    );
    const [libPanelState, setLibPanelState] = useState(`${styles.libPanel}`);

    const showLibraries = () => {
        setLibBtnState(`${btnStyles.justBtn} ${btnStyles.libBtn} ${btnStyles.actBtn}`);
        setPropBtnState(`${btnStyles.justBtn} ${btnStyles.propBtn}`);
        setPropsPanelState(`${styles.propsPanel} ${styles.panelHidden}`);
        setLibPanelState(`${styles.libPanel}`);
    };
    const showProperties = () => {
        setPropBtnState(`${btnStyles.justBtn} ${btnStyles.propBtn} ${btnStyles.actBtn}`);
        setLibBtnState(`${btnStyles.justBtn} ${btnStyles.libBtn}`);
        setLibPanelState(`${styles.libPanel} ${styles.panelHidden}`);
        setPropsPanelState(`${styles.propsPanel}`);
    };


    const [druggedNode, setDruggedNode] = useState<AtlasNode | null>(null);
    const [selectedNode, setSelectedNode] = useState<AtlasNode | null>(null);
    const [uiNodes, setUiNodes] = useState(WebInterfaceUtils.getUiNodes(atlasGraph));
    const [uiEdges, setUiEdges] = useState(WebInterfaceUtils.getUiEdges(atlasGraph));
    const webInterfaceUtils = new WebInterfaceUtils(
        atlasGraph,
        selectedNode,
        setUiNodes,
        setUiEdges,
        setSelectedNode,
    );

    useEffect(() => {
        selectedNode ? showProperties() : showLibraries()
    }, [selectedNode])

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

                {/*------- Buttons*/}
                <div className={libBtnState} onClick={showLibraries}>
                    <label>Libraries</label>
                </div>
                <div className={`${btnStyles.justBtn} ${btnStyles.assetsBtn}`}>
                    <label>Assets</label>
                </div>
                <div className={propBtnState} onClick={showProperties}>
                    <label>Properties</label>
                </div>
                <div className={`${btnStyles.justBtn} ${btnStyles.objBtn}`}>
                    <label>Object</label>
                </div>
                <div className={`${btnStyles.justBtn} ${btnStyles.mockupBtn}`}>
                    <label>Mockup</label>
                </div>
                <div className={`${btnStyles.justBtn} ${btnStyles.envBtn}`}>
                    <label>Environment</label>
                </div>
                <div
                    className={`${btnStyles.justBtn} ${btnStyles.elementsBtn} ${btnStyles.actBtn}`}
                >
                    <label>Elements</label>
                </div>
                <div className={`${btnStyles.justBtn} ${btnStyles.layersBtn}`}>
                    <label>Layers</label>
                </div>

                {/*-----Panels*/}
                <ElementsPanel visibleState={styles.leftpanel}/>
                <DnDFlow
                    webInterfaceUtils={webInterfaceUtils}
                    druggedNode={druggedNode}
                />
                <PropsPanel
                    propPanelStyleWrapper={propsPanelState}
                    webInterfaceUtils={webInterfaceUtils}
                />
                <LibPanel
                    setDruggedNode={setDruggedNode}
                    libPanelStyleWrapper={libPanelState}
                />
            </div>
        </>
    );
}
