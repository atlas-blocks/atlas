import Script from 'next/script';

export default function GraphicsField(): JSX.Element {
	const loadDesmos = (desmosObject: any) => {
		let elt = document.getElementById('calculator');
		let calculator = desmosObject.GraphingCalculator(elt);
		calculator.setExpression({ id: 'graph1', latex: 'y=x^2' });
	};

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
