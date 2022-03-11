import React from 'react';

import styles from '../../styles/MathInput.module.css';
import globals from '../globals';

let currentBlock: Element;

export default function MathInput() {
	const inputRef = React.useRef(null);

	function updateBlock() {
	}
	return (
		<div id={styles.math_input}>
			<input type={'text'} ref={inputRef} />
			<button onClick={updateBlock}>ok</button>
		</div>
	);
}

