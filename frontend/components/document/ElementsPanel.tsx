import styles from '../../styles/main.module.css';

export default function ElementsPanel(props: any) {
	const showNodes = () => {
		let result = JSON.stringify(props.nodes, null, 2);
		// let result = props?.nodes.map(node => JSON.stringify(node))
		return result;
		// return props?.nodes.toString() ?? ""
	};

	return (
		<div className={props.visibleState}>
			<div className={styles.elementsWrapper}>
				{/*<pre>{JSON.stringify(props.nodes, null, 2)}</pre>*/}
			</div>
		</div>
	);
}
