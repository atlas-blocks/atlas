import React, { useEffect, useState } from 'react';
import Script from 'next/script';
import { wiu } from '../../utils/WebInterfaceUtils';
import { AtlasNode, DesmosNode } from '../../utils/AtlasGraph';

export default function DesmosGraphic({ desmosNode }: { desmosNode: AtlasNode }): JSX.Element {
	const [desmosGraphic, setDesmosGraphic] = useState<Desmos.GraphingCalculator>(null);

	const loadDesmos = (desmosObject) => {
		const elt = document.getElementById('calculator');
		setDesmosGraphic(
			desmosObject.GraphingCalculator(elt, { fontSize: 12, expressionsCollapsed: true }),
		);
	};

	useEffect(() => {
		if (!(desmosNode instanceof DesmosNode)) return;
		desmosGraphic.setExpression({
			id: 'graph1',
			latex: 'y = ' + desmosNode.content,
		});
		setDesmosGraphic(desmosGraphic);
		wiu.setSelectedNode(desmosNode);
	}, [desmosNode]);

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
