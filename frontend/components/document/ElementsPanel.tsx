import styles from '../../styles/ElementsPanel.module.css';
import WebInterfaceUtils from '../../utils/WebInterfaceUtils';
import { AtlasNode } from '../../utils/AtlasGraph';

type Props = {
	webInterfaceUtils: WebInterfaceUtils;
};

export default function ElementsPanel({ webInterfaceUtils }: Props) {
	function getNodeTypeName(type: string) {
		return type.slice(11, type.length);
	}

	function getElements(node: AtlasNode): JSX.Element {
		let selectedStyle: string = styles.elsElement;

		if (webInterfaceUtils.selectedNode == node) {
			selectedStyle += ' ' + `${styles.elsElementSelected}`;
		}

		const selectElement = () => webInterfaceUtils.setSelectedNode(node);

		return (
			<div key={node.name} className={selectedStyle} onClick={selectElement}>
				<span className={styles.elementName}>{node.name}</span>
				<span>: {getNodeTypeName(node.type)}</span>
			</div>
		);
	}

	return <>{webInterfaceUtils.graph.nodes.map((node) => getElements(node))}</>;
}
