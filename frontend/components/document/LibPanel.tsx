import styles from '../../styles/LibPanel.module.css';

export default function LibPanel(props: any) {
    const onDragStart = (event: any, nodeType: any) => {
        event.dataTransfer.setData('application/reactflow', nodeType);
        event.dataTransfer.effectAllowed = 'move';
    };

    return (
        <div className={`${props.visibleState}`}>
            <div className={styles.libSection}>
            <div className={styles.libPanelWrapper}>
                <label> &or; Basic</label>
            </div>
            <div className={styles.elementsContainer}>
                <div
                    className={styles.elementSingle}
                    onDragStart={(event) => onDragStart(event, 'expressionNode')}
                    draggable
                >
                    <label>Expr</label>
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
            </div>
            <div className={styles.libPanelWrapper}>
                <label> &or; Symbolic</label>
            </div>
            <div className={styles.elementsContainer}>
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
            <div className={styles.libPanelWrapper}>
                <label> &or; Import</label>
            </div>
            <div className={styles.elementsContainer}>
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
            </div>
            <div className={styles.libPanelWrapper}>
                <label> &or; Physical</label>
            </div>
            <div className={styles.elementsContainer}>
                <div
                    className={styles.elementSingle}
                    onDragStart={(event) => onDragStart(event, 'expressionNode')}
                    draggable
                >
                    <label>Custom object</label>
                </div>
            </div>
        </div>
    );
}
