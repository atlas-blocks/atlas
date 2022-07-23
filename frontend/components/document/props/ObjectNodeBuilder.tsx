import styles from '../../../styles/ObjectNodeProps.module.css';
import React, { ChangeEvent, useEffect, useState } from 'react';
import { InputState } from './propsInputFields';
import { wiu } from '../../../src/utils/WebInterfaceUtils';
import ObjectNode from '../../../src/graph/nodes/ObjectNode';

function ObjectBuilder({ contentInputState }: { contentInputState: InputState }): JSX.Element {
	const [objProperties, setObjProperties] = useState<[string, string][]>(
		wiu.selectedNode instanceof ObjectNode ? wiu.selectedNode.ui_objProperties : [],
	);

	const addNewProperty = () => {
		setObjProperties((prev: [string, string][]) => [...prev, ['', '']]);
	};

	const getObjProperty = (index: number): JSX.Element => {
		const handleChangeOfProperty = (event: ChangeEvent<HTMLInputElement>) => {
			const isPropertyPart = event.target.id.slice(13, 14) === '0' ? true : false;
			const propIndex = parseInt(event.target.id.slice(14, event.target.id.length));
			const updatedPart = event.target.value;

			const updatedObjProperties: [string, string][] = objProperties.map(
				(item: [string, string], index: number) => {
					if (index !== propIndex) return item;
					return isPropertyPart ? [updatedPart, item[1]] : [item[0], updatedPart];
				},
			);
			setObjProperties(updatedObjProperties);
		};

		return (
			<div key={index}>
				<div className={styles.objectPropertyContainer}>
					<input
						id={'objectBuilder0' + index.toString()}
						value={objProperties[index][0]}
						onChange={handleChangeOfProperty}
					/>
					<input
						id={'objectBuilder1' + index.toString()}
						value={objProperties[index][1]}
						onChange={handleChangeOfProperty}
					/>
				</div>
			</div>
		);
	};

	useEffect(() => {
		setObjProperties(objProperties);

		if (!(wiu.selectedNode instanceof ObjectNode)) return;
		wiu.selectedNode.setObjProperties(objProperties);
		contentInputState.setState(wiu.selectedNode.getContent());
	}, [objProperties]);

	useEffect(() => {
		if (!(wiu.selectedNode instanceof ObjectNode)) return;
		setObjProperties(wiu.selectedNode.ui_objProperties);
	}, [wiu.selectedNode]);

	return (
		<div className={styles.objectPropsWrapper}>
			<label className={styles.objectPropsName}>object builder</label>
			<div className={styles.allPropertiesWrapper}>
				<div className={styles.objectPropertyContainer}>
					<label>property</label>
					<label>value</label>
				</div>
				{objProperties.map((property, index) => getObjProperty(index))}
				<button className={styles.btnAddProperty} onClick={addNewProperty}>
					add
				</button>
			</div>
		</div>
	);
}

export default function getObjectBuilder(inputState: InputState): JSX.Element {
	return <ObjectBuilder key="objectBuilder" contentInputState={inputState} />;
}
