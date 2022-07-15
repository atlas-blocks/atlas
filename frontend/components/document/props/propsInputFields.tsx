import React from 'react';
import styles from '../../../styles/PropsPanel.module.css';

export class InputState {
	name: string;
	state: string;
	setState: React.Dispatch<React.SetStateAction<string>>;

	/**
	 * Constructs InputState
	 * @param name must be equal to the name of a AtlasNode field
	 * @param newState
	 */
	constructor(name: string, newState: [string, React.Dispatch<React.SetStateAction<string>>]) {
		this.name = name;
		this.state = newState[0];
		this.setState = newState[1];
	}

	private capitalizeFirstLetter(string: string): string {
		return string.charAt(0).toUpperCase() + string.slice(1);
	}

	public getNameSetter(): string {
		return 'set' + this.capitalizeFirstLetter(this.name);
	}
}

export class NodeInput {
	inputState: InputState;
	jsxElementGetter: (inputState: InputState) => JSX.Element;

	constructor(inputState: InputState, jsxElementGetter: (inputState: InputState) => JSX.Element) {
		this.inputState = inputState;
		this.jsxElementGetter = jsxElementGetter;
	}
}

const inputFieldWrapper = (inputState: InputState, inside: JSX.Element | string): JSX.Element => {
	return (
		<div className={styles.propsPanelWrapper} key={inputState.name}>
			<label>{inputState.name}</label>
			{inside}
		</div>
	);
};

export const getTextareaField = (inputState: InputState, disabled = false): JSX.Element => {
	return inputFieldWrapper(
		inputState,
		<textarea
			className={disabled ? styles.disabledTextInput : ''}
			value={inputState.state}
			onChange={(event) => inputState.setState(event.target.value)}
		/>,
	);
};

export const getInputField = (inputState: InputState, disabled = false): JSX.Element => {
	return inputFieldWrapper(
		inputState,
		<input
			className={disabled ? styles.disabledTextInput : ''}
			value={inputState.state}
			onChange={(event) => inputState.setState(event.target.value)}
		/>,
	);
};
