import React, { useEffect, useState } from 'react';
import Script from 'next/script';
import { wiu } from '../../utils/WebInterfaceUtils';
import { AtlasNode, DesmosNode } from '../../utils/AtlasGraph';

type Props = {
	desmosNodeName: string;
};

export default function DesmosGraphic({ desmosNodeName }: Props): JSX.Element {
	const [desmosGraphic, setDesmosGraphic] = useState<Desmos.GraphingCalculator>(null);

	const loadDesmos = (desmosObject) => {
		const elt = document.getElementById('calculator');
		setDesmosGraphic(desmosObject.GraphingCalculator(elt));
	};

	useEffect(() => {
		const getNodeByDesmosName: AtlasNode = wiu.graph.nodes.filter(
			(node) => node.name === desmosNodeName,
		)[0];
		if (getNodeByDesmosName instanceof DesmosNode) {
			desmosGraphic.setExpression({
				id: 'graph1',
				latex: 'y = ' + getNodeByDesmosName.content,
			});
			setDesmosGraphic(desmosGraphic);
		}
	}, [desmosNodeName]);

	return (
		<>
			<Script
				src="https://www.desmos.com/api/v1.7/calculator.js?apiKey=dcb31709b452b1cf9dc26972add0fda6"
				onLoad={() => loadDesmos(window.Desmos)}
				onError={(e) => {
					console.error('Desmos script failed to load', e);
				}}
			/>

			<div id={'calculator'} style={{ height: '100%', width: '100%' }}></div>
		</>
	);
}
