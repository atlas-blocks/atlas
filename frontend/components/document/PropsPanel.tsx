import styles from '../../styles/PropsPanel.module.css';
// import {setNodeName} from "./reactflow"
import React, {ChangeEvent, useEffect, useImperativeHandle, useState} from 'react';
import { any } from 'prop-types';
import AtlasGraph, {AtlasNode, ContentNode} from "../../utils/AtlasGraph";
// import {useNodesState} from "react-flow-renderer";
// import {initialNodes} from "./nodes_edges";
// import Flow from "./reactflow";
import WebInterfaceUtils from "../../utils/WebInterfaceUtils";
import {atlasGraph} from "./DnDFlow";

type Props = {
	propPanelStyleWrapper: string;
	// selectedNode: AtlasNode | null;
	webInterfaceUtils: WebInterfaceUtils;
}

export default function PropsPanel({propPanelStyleWrapper, webInterfaceUtils}: Props): JSX.Element {
	// const [updNode, setUpdNode] = useState<any>()
	//
	// useEffect(() => {
	//     setUpdNode(props.editNode)
	// }, [props.editNode])
	//
	// useEffect(() => {
	//     props.updNode(updNode)
	// }, [updNode])

	// const changeName = (evt: any) => {
	//     setUpdNode(prev => ({...prev, data: {...prev.data, name: evt.target.value}}))
	// }
	// const changeContent = (evt) => {
	//     setUpdNode(prev => ({...prev, data: {...prev.data, content: evt.target.value}}))
	// }


	// const [contentValue, setContentValue] = useState<string>('')
	const [newContentValue, setNewContentValue] = useState<string>('')
	const [newNameValue, setNewNameValue] = useState<string>('')

	// const [uiNodes, setUiNodes] = useState(WebInterfaceUtils.getUiNodes(webInterfaceUtils.graph));
	// const [uiEdges, setUiEdges] = useState(WebInterfaceUtils.getUiEdges(webInterfaceUtils.graph));

	const updContVal = (evt: ChangeEvent<HTMLInputElement>) => {
		setNewContentValue(evt.target.value)
	}
	const updNameVal = (evt: ChangeEvent<HTMLInputElement>) => {
		setNewNameValue(evt.target.value)
	}

	const submitChanges = async () => {
		if (webInterfaceUtils.selectedNode instanceof ContentNode) {
			webInterfaceUtils.selectedNode.content = newContentValue
			// webInterfaceUtils.selectedNode.name = newNameValue
			// webInterfaceUtils.refreshUiElements()
			console.log(webInterfaceUtils.selectedNode.name)
			await webInterfaceUtils.updateGraph()

			webInterfaceUtils.setSelectedNode(null)
		}
	}



	useEffect(() => {
		if (webInterfaceUtils.selectedNode instanceof ContentNode) {
			setNewContentValue(webInterfaceUtils.selectedNode.content)
			setNewNameValue(webInterfaceUtils.selectedNode.name)
			}
	}, [webInterfaceUtils.selectedNode])

	return (
		<div className={`${propPanelStyleWrapper}`}>
			<div className={styles.propsPanelWrapper}>
				<label>Name</label>
				{/*<input type="light" value={updNode?.data.name ?? ""} onChange={changeName} disabled={!updNode} />*/}
				<input className={styles.inpName} value={newNameValue} onChange={updNameVal}/>
			</div>
			<div className={styles.propsPanelWrapper}>
				<label style={{ width: '100%' }}>Content</label>
				{/*<input type="content" value={updNode?.data.content ?? ""} onChange={changeContent} disabled={!updNode} />*/}
				<input className={styles.inpContent} value={newContentValue} onChange={updContVal} />
			</div>
			<div className={styles.propsPanelWrapper}>
				<button className={styles.btnSubmit} onClick={submitChanges}>Submit</button>
			</div>
		</div>
	);
}
