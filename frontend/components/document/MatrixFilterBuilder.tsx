import React, { useEffect, useRef, useState } from 'react';
import styles from '../../styles/MatrixFilterBuilder.module.css';

type Props = {
	setNewContentValue: React.Dispatch<React.SetStateAction<string>>;
};

export default function MatrixFilterBuilder({ setNewContentValue }: Props): JSX.Element {
	const initFltrCols = [
		{
			cond: '',
			exp: '',
		},
	];
	const initFltrRows = [
		{
			cond: '',
			exp: '',
		},
	];

	const [filterCols, setFilterCols] = useState<typeof initFltrCols>(initFltrCols);
	const [filterRows, setFilterRows] = useState<typeof initFltrRows>(initFltrRows);
	const refCol = useRef<HTMLInputElement[][]>([[], [], []]);
	const refRow = useRef<HTMLInputElement[][]>([[], [], []]);
	const refMatrixName = useRef<HTMLInputElement>(null!);

	const getExprCols = (mxName: string, num: string, opr: string, val: string) =>
		num !== '' && num !== '..'
			? 'broadcast(' + opr + ', getindex(' + mxName + ', .., ' + num + '), ' + val + ')'
			: '..';
	const getExprRows = (mxName: string, num: string, opr: string, val: string) =>
		num !== '' && num !== '..'
			? 'broadcast(' + opr + ', getindex(' + mxName + ', ' + num + ', ..), ' + val + ')'
			: '..';

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

	const addFilter = (cols: boolean, cond: string) => {
		cols
			? setFilterCols(() => filterCols.concat({ cond: cond, exp: '' }))
			: setFilterRows(() => filterRows.concat({ cond: cond, exp: '' }));
	};

	let resCols = '';
	let resRows = '';
	let finalExp = '';
	filterCols.forEach((item: { cond: string; exp: string }, index: number) => {
		index
			? (resCols = 'broadcast(' + item.cond + ',' + resCols + ',' + item.exp + ')')
			: (resCols = item.exp);
	});
	filterRows.forEach((item: { cond: string; exp: string }, index: number) => {
		index
			? (resRows = 'broadcast(' + item.cond + ',' + resRows + ',' + item.exp + ')')
			: (resRows = item.exp);
	});
	finalExp = 'getindex(' + refMatrixName.current?.value + ', ' + resCols + ', ' + resRows + ')';

	useEffect(() => {
		setNewContentValue(finalExp);
	}, [finalExp]);

	function listFilters(index: number, cols: boolean): JSX.Element {
		return (
			<div key={index}>
				<label>{cols ? 'col:' : 'row:'}</label>
				<input
					ref={(el: HTMLInputElement) =>
						cols ? (refCol.current[0][index] = el) : (refRow.current[0][index] = el)
					}
					onChange={filterChange}
				/>
				<label>opr:</label>
				<input
					ref={(el: HTMLInputElement) =>
						cols ? (refCol.current[1][index] = el) : (refRow.current[1][index] = el)
					}
					onChange={filterChange}
				/>
				<label>val:</label>
				<input
					ref={(el: HTMLInputElement) =>
						cols ? (refCol.current[2][index] = el) : (refRow.current[2][index] = el)
					}
					onChange={filterChange}
				/>
			</div>
		);
	}

	return (
		<div>
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
					<button className={styles.btnFilter} onClick={() => addFilter(true, '&')}>
						and
					</button>
					<button className={styles.btnFilter} onClick={() => addFilter(true, '||')}>
						or
					</button>
				</div>

				{filterRows.map((item: { cond: string; exp: string }, index: number) =>
					listFilters(index, false),
				)}
				<div>
					<button className={styles.btnFilter} onClick={() => addFilter(false, '&')}>
						and
					</button>
					<button className={styles.btnFilter} onClick={() => addFilter(false, '||')}>
						or
					</button>
				</div>
			</div>
		</div>
	);
}
