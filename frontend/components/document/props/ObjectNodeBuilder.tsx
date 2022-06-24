import styles from '../../../styles/ObjectNodeProps.module.css';
import React, { ChangeEvent, useEffect, useRef, useState } from 'react';
import { InputState } from './propsInputFields';

type Props = {
	newObjProperties: string[][];
	setNewObjProperties: React.Dispatch<React.SetStateAction<string[][]>>;
};

function ObjectNodeBuilder({ newObjProperties, setNewObjProperties }: Props): JSX.Element {
	const [objProperties, setObjProperties] = useState<string[][]>(newObjProperties);

	const addNewProperty = () => {
		setObjProperties((prev: string[][]) => [...prev, ['', '']]);
	};

	function getObjProperty(property: string[], index: number): JSX.Element {
		const handleChangeOfProperty = (event: ChangeEvent<HTMLInputElement>) => {
			setObjProperties(
				objProperties.map((item: string[], index: number) => {
					if (index === parseInt(event.target.id.slice(1, event.target.id.length))) {
						return event.target.id.slice(0, 1) === '0'
							? [event.target.value, item[1]]
							: [item[0], event.target.value];
					} else {
						return item;
					}
				}),
			);
		};

		return (
			<div key={index}>
				<div className={styles.objectPropertyContainer}>
					<input
						id={'0' + index.toString()}
						value={objProperties[index][0]}
						onChange={(event: ChangeEvent<HTMLInputElement>) =>
							handleChangeOfProperty(event)
						}
					/>
					<input
						id={'1' + index.toString()}
						value={objProperties[index][1]}
						onChange={(event: ChangeEvent<HTMLInputElement>) =>
							handleChangeOfProperty(event)
						}
					/>
				</div>
			</div>
		);
	}

	useEffect(() => {
		setNewObjProperties(objProperties);
	}, [objProperties]);

	return (
		<div className={styles.objectPropsWrapper}>
			<label className={styles.objectPropsName}>object builder</label>
			<div className={styles.allPropertiesWrapper}>
				<div className={styles.objectPropertyContainer}>
					<label>property</label>
					<label>value</label>
				</div>
				{objProperties.map((property: string[], index: number) =>
					getObjProperty(property, index),
				)}
				<button className={styles.btnAddProperty} onClick={addNewProperty}>
					add
				</button>
			</div>
		</div>
	);
}

const getObjectBuilder = (inputState: InputState): JSX.Element => {
	console.log(inputState.state);
	return (
		<ObjectNodeBuilder
			key="objectBuilder"
			newObjProperties={inputState.state}
			setNewObjProperties={inputState.setState}
		/>
	);
};

export default getObjectBuilder;
