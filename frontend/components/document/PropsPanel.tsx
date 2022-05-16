import styles from '../../styles/PropsPanel.module.css';
// import {setNodeName} from "./reactflow"
import { useEffect, useRef, useState } from 'react';
import { any } from 'prop-types';
// import {useNodesState} from "react-flow-renderer";
// import {initialNodes} from "./nodes_edges";
// import Flow from "./reactflow";

export default function PropsPanel(props: any) {
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

	return (
		<div className={props.visibleState}>
			<div className={styles.propsPanelWrapper}>
				<label>Name</label>
				{/*<input type="light" value={updNode?.data.name ?? ""} onChange={changeName} disabled={!updNode} />*/}
				<input className={styles.inpName} />
			</div>
			<div className={styles.propsPanelWrapper}>
				<label style={{ width: '100%' }}>Content</label>
				{/*<input type="content" value={updNode?.data.content ?? ""} onChange={changeContent} disabled={!updNode} />*/}
				<input className={styles.inpContent} />
			</div>
		</div>
	);
}
