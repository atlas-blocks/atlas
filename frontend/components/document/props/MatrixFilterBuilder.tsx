import React, { useEffect, useRef, useState } from 'react';
import styles from '../../../styles/MatrixFilterBuilder.module.css';
import stylesOfProps from '../../../styles/PropsPanel.module.css';
import { InputState } from './propsInputFields';

type Props = {
	setNewContentValue: React.Dispatch<React.SetStateAction<string>>;
};

function MatrixFilterBuilder({ setNewContentValue }: Props): JSX.Element {
	const initFilterCols = [
		{
			cond: '',
			exp: '',
		},
	];
	const initFilterRows = [
		{
			cond: '',
			exp: '',
		},
	];

	const [filterCols, setFilterCols] = useState<typeof initFilterCols>(initFilterCols);
	const [filterRows, setFilterRows] = useState<typeof initFilterRows>(initFilterRows);
	const refCol = useRef<HTMLInputElement[][]>([[], [], []]);
	const refRow = useRef<HTMLInputElement[][]>([[], [], []]);
	const refMatrixName = useRef<HTMLInputElement>(null!);

	const getExprCols = (mxName: string, colName: string, opr: string, val: string) => {
		if (colName !== '' && colName !== ':')
			return mxName + '[:,' + colName + '] .' + opr + ' ' + val;
		else return ':';
	};

	const getExprRows = (mxName: string, rowName: string, opr: string, val: string) => {
		if (rowName !== '' && rowName !== ':')
			return mxName + '[' + rowName + ',:] .' + opr + ' ' + val;
		else return ':';
	};

	const filterChange = () => {
		setFilterCols(() =>
			filterCols.map((item: { cond: string; exp: string }, index: number) =>
				Object.assign(item, {
					exp: getExprCols(
						refMatrixName.current.value,
						refCol.current[0][index].value,
						refCol.current[1][index].value === '='
							? '=='
							: refCol.current[1][index].value,
						refCol.current[2][index].value,
					),
				}),
			),
		);

		setFilterRows(() =>
			filterRows.map((item: { cond: string; exp: string }, index: number) =>
				Object.assign(item, {
					exp: getExprRows(
						refMatrixName.current.value,
						refRow.current[0][index].value,
						refRow.current[1][index].value === '='
							? '=='
							: refRow.current[1][index].value,
						refRow.current[2][index].value,
					),
				}),
			),
		);
	};

	const addNewConditionToFilter = (cols: boolean, cond: string) => {
		cols
			? setFilterCols(() => filterCols.concat({ cond: cond, exp: '' }))
			: setFilterRows(() => filterRows.concat({ cond: cond, exp: '' }));
	};

	let resCols = '';
	let resRows = '';
	let finalExp = '';
	filterCols.forEach((item: { cond: string; exp: string }, index: number) => {
		if (index !== 0) resCols += ' .' + item.cond + ' (' + item.exp + ')';
		else resCols = '(' + item.exp + ')';
	});
	filterRows.forEach((item: { cond: string; exp: string }, index: number) => {
		if (index !== 0) resRows += ' .' + item.cond + '(' + item.exp + ')';
		else resRows = '(' + item.exp + ')';
	});
	finalExp = refMatrixName.current?.value + '[' + resCols + ', ' + resRows + ']';

	useEffect(() => {
		if (refMatrixName.current?.value) setNewContentValue(finalExp);
	}, [finalExp]);

	function listFilters(index: number, cols: boolean): JSX.Element {
		return (
			<div key={index}>
				<label>{cols ? 'col:' : 'row:'}</label>
				<input
					ref={(el: HTMLInputElement) =>
						cols
							? (refCol.current[0][index] = el)
							: (refRow.current[0][index] = el)
					}
					onChange={filterChange}
				/>
				<label>opr:</label>
				<input
					ref={(el: HTMLInputElement) =>
						cols
							? (refCol.current[1][index] = el)
							: (refRow.current[1][index] = el)
					}
					onChange={filterChange}
				/>
				<label>val:</label>
				<input
					ref={(el: HTMLInputElement) =>
						cols
							? (refCol.current[2][index] = el)
							: (refRow.current[2][index] = el)
					}
					onChange={filterChange}
				/>
			</div>
		);
	}

	return (
		<div className={stylesOfProps.propsPanelWrapper}>
			<label>Filter Builder</label>
			<div className={styles.filterWrapper}>
				<div>
					<label>matrix:</label>
					<input
						style={{ width: '140px' }}
						ref={refMatrixName}
						className={styles.inpName}
						onChange={filterChange}
					/>
				</div>

				{filterCols.map((item: { cond: string; exp: string }, index: number) =>
					listFilters(index, true),
				)}

				<div>
					<button
						className={styles.btnFilter}
						onClick={() => addNewConditionToFilter(true, '&')}
					>
						and
					</button>
					<button
						className={styles.btnFilter}
						onClick={() => addNewConditionToFilter(true, '||')}
					>
						or
					</button>
				</div>

				{filterRows.map((item: { cond: string; exp: string }, index: number) =>
					listFilters(index, false),
				)}
				<div>
					<button
						className={styles.btnFilter}
						onClick={() => addNewConditionToFilter(false, '&')}
					>
						and
					</button>
					<button
						className={styles.btnFilter}
						onClick={() => addNewConditionToFilter(false, '||')}
					>
						or
					</button>
				</div>
			</div>
		</div>
	);
}

const getMatrixBuilderField = (inputState: InputState): JSX.Element => {
	return (
		<MatrixFilterBuilder
			key="matrixFilter"
			setNewContentValue={inputState.setState}
		/>
	);
};

export default getMatrixBuilderField;
