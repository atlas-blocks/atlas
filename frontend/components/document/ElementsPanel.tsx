import styles from '../../styles/ElementsPanel.module.css';
import WebInterfaceUtils from '../../utils/WebInterfaceUtils';
import { AtlasNode } from '../../utils/AtlasGraph';

type Props = {
	webInterfaceUtils: WebInterfaceUtils;
};

export default function ElementsPanel({ webInterfaceUtils }: Props) {
	let selectedStyle: string = styles.elsElement;

	function listElements(node: AtlasNode): JSX.Element {
		webInterfaceUtils.selectedNode == node
			? (selectedStyle =
					`${styles.elsElement}` +
					' ' +
					`${styles.elsElementSelected}
		}`)
			: (selectedStyle = styles.elsElement);

		const selectElement = () => webInterfaceUtils.setSelectedNode(node);

		return (
			<div key={node.name} className={selectedStyle} onClick={selectElement}>
				<span style={{ color: '#30a5be' }}>{node.name}</span>
				<span>: {node.type.slice(11, node.type.length)}</span>
			</div>
		);
	}

	return <>{webInterfaceUtils.graph.nodes.map((node) => listElements(node))}</>;
}
