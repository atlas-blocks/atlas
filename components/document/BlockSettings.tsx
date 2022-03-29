import React, { ChangeEvent, useState } from 'react';
import styles from '../../styles/BlockSettings.module.css';
import Node from '../../commons/nodes/Node';
import SimplifyNode from '../../commons/nodes/formulas/SimplifyNode';
import { page } from '../../pages/document';
import FormulaNode from '../../commons/nodes/formulas/FormulaNode';
import WebInterfaceUtils from '../../utils/WebInterfaceUtils';

type Props = {
	selectedNode: Node | null;
	webInterfaceUtils: WebInterfaceUtils;
};

function BlockSettings(props: Props) {
	const updateField = (event: ChangeEvent<HTMLInputElement>, field: string) => {
		const newFormula = page
			.getGraph()
			.getNodesByNameAndClassType<FormulaNode>(event.target.value, FormulaNode)[0];
		(props.selectedNode as SimplifyNode).setFormula(newFormula);
		(props.selectedNode as SimplifyNode)
			.fetchLatexAsync()
			.then(() => props.webInterfaceUtils.refreshElements())
			.catch();
	};
	const getSettingsJSX = (node: Node) => {
		return (
			<div id={styles.settings_container}>
				<div>id: {node.getId()}</div>
				<div>name: {node.getName()}</div>
				<div>description: {node.getDescription()}</div>
				{node instanceof SimplifyNode && (
					<div>
						formula name: {(props.selectedNode as SimplifyNode).getFormulaName()}
						<input onChange={(event) => updateField(event, 'formula')} />
					</div>
				)}
			</div>
		);
	};
	return (
		<aside id={styles.settings} style={{ right: props.selectedNode === null ? '-300px' : '0' }}>
			<h2>Block Settings</h2>
			{props.selectedNode === null ? '' : getSettingsJSX(props.selectedNode)}
		</aside>
	);
}

export default BlockSettings;
