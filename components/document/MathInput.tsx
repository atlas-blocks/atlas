import React, { ChangeEvent } from 'react';

import styles from '../../styles/MathInput.module.css';

type Props = {
	nodeLatex: string;
	setNodeLatex: React.Dispatch<React.SetStateAction<any>>;
};

export default class MathInput extends React.Component<Props, { inputBottom: string }> {
	constructor(props: Props) {
		super(props);
		this.state = {
			inputBottom: '-200px',
		};
	}

	public hideMathInput() {
		this.setState({ inputBottom: '-200px' });
	}

	public showMathInput() {
		this.setState({ inputBottom: '0px' });
	}

	updateBlock = (event: ChangeEvent<HTMLInputElement>) => {
		this.props.setNodeLatex(event.target.value);
	};

	submitInput = () => {
		this.hideMathInput();
	};

	render() {
		return (
			<div id={styles.math_input} style={{ bottom: this.state.inputBottom }}>
				<input type={'text'} value={this.props.nodeLatex} onChange={this.updateBlock} />
				<button onClick={this.submitInput}>OK</button>
			</div>
		);
	}
}
