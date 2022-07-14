import React from 'react';
import Script from 'next/script';
import { wiu } from '../../utils/WebInterfaceUtils';
import { DesmosNode } from '../../utils/AtlasGraph';

let calculator: any = null;

type Props = {
	desmosName: string;
};

export default function DesmosGraphic({ desmosName }: Props): JSX.Element {
	const loadDesmos = (desmosObject: any) => {
		const elt = document.getElementById('calculator');
		calculator = desmosObject.GraphingCalculator(elt);
		// calculator.setExpression({ id: 'graph1', latex: 'y=x^2' });
	};

	wiu.graph.nodes.forEach((node) => {
		if (node instanceof DesmosNode && node.name === desmosName) {
			console.log(desmosName);
			// calculator.setExpression({
			// 	id: desmosName,
			// 	latex: 'y = ' + node.content ? node.content : '',
			// });
			// console.log(node.content);
		}
	});

	return (
		<>
			<Script
				src="https://www.desmos.com/api/v1.7/calculator.js?apiKey=dcb31709b452b1cf9dc26972add0fda6"
				onLoad={() => loadDesmos(window.Desmos)}
			/>
			<div id="calculator" style={{ height: '100%', width: '100%' }}></div>
		</>
	);
}
