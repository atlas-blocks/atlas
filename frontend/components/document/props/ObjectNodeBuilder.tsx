import styles from '../../../styles/ObjectNodeProps.module.css';
import React, { ChangeEvent, useEffect, useRef, useState } from 'react';
import { InputState } from './propsInputFields';

type Props = {
	setNewContentValue: React.Dispatch<React.SetStateAction<string>>;
};

function ObjectNodeBuilder({ setNewContentValue }: Props): JSX.Element {
	const [objProperties, setObjProperties] = useState<string[][]>([['', '']]);

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
						onChange={(event: ChangeEvent<HTMLInputElement>) =>
							handleChangeOfProperty(event)
						}
					/>
					<input
						id={'1' + index.toString()}
						onChange={(event: ChangeEvent<HTMLInputElement>) =>
							handleChangeOfProperty(event)
						}
					/>
				</div>
			</div>
		);
	}

	useEffect(() => {
		let newContent = 'Dict(';
		objProperties.forEach(
			(property: string[]) => (newContent += `"${property[0]}" => ${property[1]},`),
		);
		newContent += ')';
		setNewContentValue(newContent);
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
	return <ObjectNodeBuilder key="objectBuilder" setNewContentValue={inputState.setState} />;
};

export default getObjectBuilder;
