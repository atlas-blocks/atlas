import React from 'react';
import Script from 'next/script';

import DesmosFlow from '../../../src/flows/DesmosFlow';
import { wiu } from '../../../src/utils/WebInterfaceUtils';
import { awu } from '../../../src/utils/AtlasWindowUtils';

declare global {
	interface Window {
		Desmos?: any;
	}
}

export default function UiDesmosFlow({ flow }: { flow: DesmosFlow }): JSX.Element {
	const loadDesmos = (desmosObject: any) => {
		const calculatorElement = document.getElementById('calculator/' + flow.node.name);
		calculatorElement!.innerHTML = '';
		const calculator = desmosObject.GraphingCalculator(calculatorElement, {
			fontSize: 12,
			expressionsCollapsed: true,
		});

		calculator.setExpression({
			id: 'plot1',
			latex: flow.node.getContent(),
		});

		wiu.setSelectedNode(flow.node);
	};

	React.useEffect(() => {
		if (awu.getSelectedFlow() !== flow) return;
		if (window.Desmos) loadDesmos(window.Desmos);
	});

	return (
		<>
			<Script
				src="https://www.desmos.com/api/v1.7/calculator.js?apiKey=dcb31709b452b1cf9dc26972add0fda6"
				onLoad={() => loadDesmos(window.Desmos)}
			/>
			<div
				id={'calculator/' + flow.node.name}
				style={{ height: '100%', width: '100%' }}
			></div>
		</>
	);
}
