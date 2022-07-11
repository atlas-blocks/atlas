import styles from '../../styles/ElementsPanel.module.css';
import { wiu } from '../../utils/WebInterfaceUtils';
import { AtlasNode } from '../../utils/AtlasGraph';

export default function ElementsPanel() {
	function getNodeTypeName(type: string) {
		return type.slice(11, type.length);
	}

	function getPanelElement(node: AtlasNode): JSX.Element {
		let selectedStyle: string = styles.element;

		if (wiu.selectedNode == node) {
			selectedStyle += ' ' + styles.elementSelected;
		}

		// adding key

		const selectElement = () => wiu.setSelectedNode(node);

		return (
			<div key={node.getId()} className={selectedStyle} onClick={selectElement}>
				<span className={styles.elementName}>{node.name}</span>
				<span>: {getNodeTypeName(node.uitype)}</span>
			</div>
		);
	}

	return <>{wiu.graph.nodes.map((node) => getPanelElement(node))}</>;
}
