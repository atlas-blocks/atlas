import React, { ChangeEvent } from 'react';

import styles from '../../styles/MathInput.module.css';
import WebInterfaceUtils from '../../utils/WebInterfaceUtils';
import { AtlasNode, ExpressionNode } from '../../utils/AtlasGraph';

type Props = {
	selectedNode: AtlasNode | null;
	webInterfaceUtils: WebInterfaceUtils;
};
type States = { inputBottom: string; inputValue: string };

export default class MathInput extends React.Component<Props, States> {
	private readonly elementHeight: string;

	constructor(props: Props) {
		super(props);
		this.elementHeight = '100px';
		this.state = {
			inputValue:
				this.props.selectedNode instanceof ExpressionNode
					? this.props.selectedNode.content
					: '',
			inputBottom: '-200px',
		};
	}

	public show(inputValue: string) {
		this.setState({ inputValue: inputValue });
		this.setState({ inputBottom: '0px' });
	}

	public hide() {
		this.setState({ inputBottom: '-' + this.elementHeight });
	}

	updateBlock = (event: ChangeEvent<HTMLInputElement>) => {
		this.setState({ inputValue: event.target.value });
	};

	submitInput = async () => {
		if (this.props.selectedNode instanceof ExpressionNode) {
			this.props.selectedNode.content = this.state.inputValue; 
			await this.props.webInterfaceUtils.updateGraph();
		}
		this.hide();
	};

	render() {
		return (
			<div
				id={styles.math_input}
				style={{ bottom: this.state.inputBottom, height: this.elementHeight }}
			>
				<input type={'text'} value={this.state.inputValue} onChange={this.updateBlock} />
				<button onClick={this.submitInput}>OK</button>
			</div>
		);
	}
}
