import styles from '../../styles/LibPanel.module.css';
import styles_main from '../../styles/main.module.css';

import React, {useState} from 'react';
import {AtlasNode, ExpressionNode, TextNode, FileNode} from '../../utils/AtlasGraph';
import WebInterfaceUtils from '../../utils/WebInterfaceUtils';
import blockStyles from "../../styles/Block.module.css";

type Props = {
    // selectedNode: AtlasNode | null;
    setDruggedNode: React.Dispatch<React.SetStateAction<AtlasNode | null>>;
    // webInterfaceUtils: WebInterfaceUtils | null;
    libPanelStyleWrapper: string;
};


export default function LibPanel({setDruggedNode, libPanelStyleWrapper}: Props): JSX.Element {
    const onDragStart = (event: React.DragEvent<HTMLDivElement>, node: AtlasNode) => {
        setDruggedNode(node);
        event.dataTransfer.effectAllowed = 'move';
    };
    // const elementWidth = '250px';

    const nodesOptions = {
        ExpressionNode: () =>
            new ExpressionNode(
                new AtlasNode(ExpressionNode.structType, '', 'pkg', [0, 0], true),
                '2 + 3',
                '5',
            ),
        TextNode: () =>
            new TextNode(
                new AtlasNode(TextNode.structType, 'name1', 'pkg', [0, 0], true),
                '1, 2, 3',
            ),
        FileNode: () =>
            new FileNode(new AtlasNode(FileNode.structType, 'name1', 'pkg', [0, 0], true), '', ''),
    };
    // const getNodeOption = (option: keyof typeof nodesOptions) => (
    //     <div className={styles.libWrapper}>
    //
    //     <div
    //         key={option}
    //         className={`${styles.dndnode} ${blockStyles.text_block}`}
    //         onDragStart={(event) => onDragStart(event, nodesOptions[option]())}
    //         draggable
    //     >
    //         {option}
    //     </div>
    //     </div>
    //
    // );


    const libElements = {
        // Symbolic: ['Simplify', 'Equal'],
        // Graphics: ['2D-plot', '3D-plot'],
        // Engineering: ['PID Controller'],
        // Import: ['JSON', 'CSV', 'XML', 'Form'],
        // Physical: ['Custom Object'],
        Basic: nodesOptions,
        Symbolic: nodesOptions,
        Graphics: nodesOptions,
        Engineering: nodesOptions,
        Import: nodesOptions,
        Physical: nodesOptions,
    };

    const libCollapseStates = {
        Basic: useState<string>(''),
        Symbolic: useState<string>(styles.containerCollapse),
        Graphics: useState<string>(styles.containerCollapse),
        Engineering: useState<string>(styles.containerCollapse),
        Import: useState<string>(styles.containerCollapse),
        Physical: useState<string>(styles.containerCollapse),
    };

    const openOrCollapseLibSection = (idName: keyof typeof libCollapseStates): void => {
        libCollapseStates[idName][1](
            libCollapseStates[idName][0] === '' ? styles.containerCollapse : '',
        );
    };

    function getLibElements(name: keyof typeof nodesOptions): JSX.Element {
        return (
            <div
                key={name}
                className={styles.elementSingle}
                onDragStart={(event) => onDragStart(event, nodesOptions[name]())}
                draggable
            >
                <span>{name.slice(0, 4)}</span>
            </div>
        );
    }


    function getLibSections(libName: keyof typeof libElements): JSX.Element {
        return (
            <div key={libName} className={styles.libWrapper}>
                <div
                    id={libName}
                    className={styles.libSectionLabel}
                    onClick={(evt) => {
                        openOrCollapseLibSection(evt.currentTarget.id as keyof typeof libElements);
                    }}
                >
                    <label>
                        {'>'} {libName}
                    </label>
                </div>
                <div className={`${styles.elementsContainer} ${libCollapseStates[libName][0]}`}>
                    {/*{libElements[libName].map((elem) => getLibElements(elem))}*/}
                    {Object.keys(libElements[libName]).map((elem) => getLibElements(elem as keyof typeof nodesOptions))}
                    {/*{Object.keys(nodesOptions).map((option) =>*/}
                    {/*    getNodeOption(option as keyof typeof nodesOptions),*/}
                    {/*)}*/}
                </div>
            </div>
        );
    }

    return (
        <div className={`${libPanelStyleWrapper}`}>
            {/*{Object.keys(nodesOptions).map((option) =>*/}
            {/*    getNodeOption(option as keyof typeof nodesOptions),*/}
            {/*)}*/}

            {Object.keys(libElements).map((name) =>
                getLibSections(name as keyof typeof libCollapseStates),
            )}
        </div>
    );
}
