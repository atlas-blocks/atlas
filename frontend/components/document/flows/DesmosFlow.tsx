import React from 'react';
import Script from 'next/script';

declare global {
	interface Window {
		Desmos?: any;
	}
}

export default function DesmosTab(): JSX.Element {
	const loadDesmos = (desmosObject: any) => {
		const calculatorElement = document.getElementById('calculator');
		const calculator = desmosObject.GraphingCalculator(calculatorElement, { fontSize: 12 });

		calculator.setExpression({ id: 'graph1', latex: 'y=x^2' });
	};

	React.useEffect(() => {
		if (window.Desmos) loadDesmos(window.Desmos);
	}, []);

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
