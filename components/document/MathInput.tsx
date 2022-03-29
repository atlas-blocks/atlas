import React from 'react';

import styles from '../../styles/MathInput.module.css';

type Props = {
	nodeLatex: string;
	setNodeLatex: React.Dispatch<React.SetStateAction<any>>;
};

export default class MathInput extends React.Component<Props, { inputBottom: string }> {
	inputRef: React.RefObject<any>;

	constructor(props: Props) {
		super(props);
		this.inputRef = React.createRef();
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

	updateBlock = () => {
		this.props.setNodeLatex(this.inputRef.current.value);
	};

	submitInput = () => {
		this.hideMathInput();
	};

	render() {
		return (
			<div id={styles.math_input} style={{ bottom: this.state.inputBottom }}>
				<input
					type={'text'}
					ref={this.inputRef}
					value={this.props.nodeLatex}
					onChange={this.updateBlock}
				/>
				<button onClick={this.submitInput}>OK</button>
			</div>
		);
	}
}
