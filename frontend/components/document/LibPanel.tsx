import styles from '../../styles/LibPanel.module.css';
import {useState} from "react";

export default function LibPanel(props: any) {
    const onDragStart = (event: any, nodeType: any) => {
        event.dataTransfer.setData('application/reactflow', nodeType);
        event.dataTransfer.effectAllowed = 'move';
    };

    const [libSectionBasic, setLibSectionBasic] = useState({open: true})
    const [libSectionSymbolic, setLibSectionSymbolic] = useState({open: false})
    const [libSectionGraphic, setLibSectionGraphic] = useState({open: false})
    const [libSectionEngineering, setLibSectionEngineering] = useState({open: false})
    const [libSectionImport, setLibSectionImport] = useState({open: false})
    const [libSectionPhysical, setLibSectionPhysical] = useState({open: false})


    return (
        <div className={`${props.visibleState}`}>
            <div className={styles.libSectionLabel} onClick={() => setLibSectionBasic({open: !libSectionBasic.open})}>
                <label> {'>'} Basic</label>
            </div>
            <div className={`${styles.elementsContainer}`}
                 style={libSectionBasic.open ? {maxHeight: "100%"} : {overflow: "hidden", maxHeight: "0px"}}
            >
                <div
                    className={styles.elementSingle}
                    onDragStart={(event) => onDragStart(event, 'expressionNode')}
                    draggable
                >
                    <span>Expr</span>
                </div>
                <div
                    className={styles.elementSingle}
                    onDragStart={(event) => onDragStart(event, 'ifNode')}
                    draggable
                >
                    <span>if</span>
                </div>
                <div
                    className={styles.elementSingle}
                    onDragStart={(event) => onDragStart(event, 'ifNode')}
                    draggable
                >
                    <span>for</span>
                </div>
            </div>

            <div className={styles.libSectionLabel}
                 onClick={() => setLibSectionSymbolic({open: !libSectionSymbolic.open})}>
                <label> {'>'} Symbolic</label>
            </div>
            <div className={styles.elementsContainer}
                 style={libSectionSymbolic.open ? {maxHeight: "100%"} : {overflow: "hidden", maxHeight: "0px"}}
            >
                <div
                    className={styles.elementSingle}
                    onDragStart={(event) => onDragStart(event, 'expressionNode')}
                    draggable
                >
                    <span>Simplify</span>
                </div>
                <div
                    className={styles.elementSingle}
                    onDragStart={(event) => onDragStart(event, 'expressionNode')}
                    draggable
                >
                    <span>Equal</span>
                </div>
            </div>

            <div className={styles.libSectionLabel}
                 onClick={() => setLibSectionGraphic({open: !libSectionGraphic.open})}>
                <label> {'>'} Graphics</label>
            </div>
            <div className={styles.elementsContainer}
                 style={libSectionGraphic.open ? {maxHeight: "100%"} : {overflow: "hidden", maxHeight: "0px"}}
            >
                <div
                    className={styles.elementSingle}
                    onDragStart={(event) => onDragStart(event, 'expressionNode')}
                    draggable
                >
                    <span>2D Plot</span>
                </div>
                <div
                    className={styles.elementSingle}
                    onDragStart={(event) => onDragStart(event, 'expressionNode')}
                    draggable
                >
                    <span>3D Plot</span>
                </div>
            </div>
            <div className={styles.libSectionLabel}
                 onClick={() => setLibSectionEngineering({open: !libSectionEngineering.open})}>
                <label> {'>'} Engineering</label>
            </div>
            <div className={styles.elementsContainer}
                 style={libSectionEngineering.open ? {maxHeight: "100%"} : {overflow: "hidden", maxHeight: "0px"}}
            >
                <div
                    className={styles.elementSingle}
                    onDragStart={(event) => onDragStart(event, 'expressionNode')}
                    draggable
                >
                    <span>PID Controller</span>
                </div>
            </div>
            <div className={styles.libSectionLabel} onClick={() => setLibSectionImport({open: !libSectionImport.open})}>
                <label> {'>'} Import</label>
            </div>
            <div className={styles.elementsContainer}
                 style={libSectionImport.open ? {maxHeight: "100%"} : {overflow: "hidden", maxHeight: "0px"}}
            >
                <div
                    className={styles.elementSingle}
                    onDragStart={(event) => onDragStart(event, 'expressionNode')}
                    draggable
                >
                    <span>JSON</span>
                </div>
                <div
                    className={styles.elementSingle}
                    onDragStart={(event) => onDragStart(event, 'expressionNode')}
                    draggable
                >
                    <span>CSV</span>
                </div>
                <div
                    className={styles.elementSingle}
                    onDragStart={(event) => onDragStart(event, 'expressionNode')}
                    draggable
                >
                    <span>XML</span>
                </div>
                <div
                    className={styles.elementSingle}
                    onDragStart={(event) => onDragStart(event, 'expressionNode')}
                    draggable
                >
                    <span>Form</span>
                </div>
            </div>

            <div className={styles.libSectionLabel}
                 onClick={() => setLibSectionPhysical({open: !libSectionPhysical.open})}>
                <label> {'>'} Physical</label>
            </div>
            <div className={styles.elementsContainer}
                 style={libSectionPhysical.open ? {maxHeight: "100%"} : {overflow: "hidden", maxHeight: "0px"}}
            >
                <div
                    className={styles.elementSingle}
                    onDragStart={(event) => onDragStart(event, 'expressionNode')}
                    draggable
                >
                    <span>Custom object</span>
                </div>
            </div>
        </div>
    )
        ;
}
