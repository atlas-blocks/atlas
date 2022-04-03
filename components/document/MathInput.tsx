import React, { ChangeEvent } from 'react';
import Node from '../../commons/nodes/Node';

import styles from '../../styles/MathInput.module.css';
import FormulaNode from '../../commons/nodes/formulas/FormulaNode';
import WebInterfaceUtils from '../../utils/WebInterfaceUtils';

type Props = {
	selectedNode: Node | null;
	webInterfaceUtils: WebInterfaceUtils;
};
type States = { inputBottom: string; inputValue: string };

export default class MathInput extends React.Component<Props, States> {
	constructor(props: Props) {
		super(props);
		this.state = {
			inputValue:
				this.props.selectedNode instanceof FormulaNode
					? this.props.selectedNode.toLatex()
					: '',
			inputBottom: '-200px',
		};
	}

	public show(inputValue: string) {
		this.setState({ inputValue: inputValue });
		this.setState({ inputBottom: '0px' });
	}

	public hide() {
		this.setState({ inputBottom: '-200px' });
	}

	updateBlock = (event: ChangeEvent<HTMLInputElement>) => {
		if (this.props.selectedNode instanceof FormulaNode)
			this.props.selectedNode.setLatex(event.target.value);
		this.props.webInterfaceUtils.refreshElements();
		this.setState({ inputValue: event.target.value });
	};

	submitInput = () => {
		this.hide();
	};

	render() {
		return (
			<div id={styles.math_input} style={{ bottom: this.state.inputBottom }}>
				<input type={'text'} value={this.state.inputValue} onChange={this.updateBlock} />
				<button onClick={this.submitInput}>OK</button>
			</div>
		);
	}
}
