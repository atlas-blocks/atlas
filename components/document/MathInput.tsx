import React from 'react';

import styles from '../../styles/MathInput.module.css';

interface Props {
	nodeLatex: string;
	setNodeLatex: React.Dispatch<React.SetStateAction<any>>;
}

export default class MathInput extends React.Component<Props> {
	inputRef: React.RefObject<any>;

	constructor(props: Props) {
		super(props);
		this.inputRef = React.createRef();
	}

	hideMathInput() {

	}

	updateBlock = () => {
		this.props.setNodeLatex(this.inputRef.current.value);
	}

	render() {


		return (
			<div id={styles.math_input}>
				<input type={'text'} ref={this.inputRef} value={this.props.nodeLatex} onChange={this.updateBlock} />
				<button onClick={this.updateBlock}>ok</button>
			</div>
		);
	}
}

