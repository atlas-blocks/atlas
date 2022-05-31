import styles from '../../styles/PropsPanel.module.css';
// import {setNodeName} from "./reactflow"
import { useEffect, useRef, useState } from 'react';
import { any } from 'prop-types';
import {AtlasNode, ContentNode} from "../../utils/AtlasGraph";
// import {useNodesState} from "react-flow-renderer";
// import {initialNodes} from "./nodes_edges";
// import Flow from "./reactflow";

type Props = {
	propPanelStyleWrapper: string;
	selectedNode: AtlasNode | null;
}

export default function PropsPanel({selectedNode, propPanelStyleWrapper}: Props): JSX.Element {
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

	// console.log(selectedNode)

	const [contentValue, setContentValue] = useState<string>('')
	useEffect(() => {
		selectedNode instanceof ContentNode ? setContentValue(selectedNode.content): setContentValue('')
	}, [selectedNode])

	return (
		<div className={`${propPanelStyleWrapper}`}>
			<div className={styles.propsPanelWrapper}>
				<label>Name</label>
				{/*<input type="light" value={updNode?.data.name ?? ""} onChange={changeName} disabled={!updNode} />*/}
				<input className={styles.inpName} defaultValue={selectedNode?.name ?? ""}/>
			</div>
			<div className={styles.propsPanelWrapper}>
				<label style={{ width: '100%' }}>Content</label>
				{/*<input type="content" value={updNode?.data.content ?? ""} onChange={changeContent} disabled={!updNode} />*/}
				<input className={styles.inpContent} defaultValue={contentValue} />
			</div>
		</div>
	);
}
