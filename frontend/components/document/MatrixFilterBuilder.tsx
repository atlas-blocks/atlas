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

	const [fltrCols, setFltrCols] = useState<any>(initFltrCols);
	const [fltrRows, setFltrRows] = useState<any>(initFltrRows);
	const refCol = useRef<any>([[], [], []]);
	const refRow = useRef<any>([[], [], []]);
	const refMxName = useRef<any>('');

	const getExprCols = (mxName: string, num: string, opr: string, val: string) =>
		'broadcast(' + opr + ',' + mxName + '[..,' + num + '], ' + val + ')';
	const getExprRows = (mxName: string, num: string, opr: string, val: string) =>
		'broadcast(' + opr + ',' + mxName + '[' + num + ',..], ' + val + ')';

	const fltrChange = () => {
		setFltrCols(() =>
			fltrCols.map((obj: any, index: number) =>
				Object.assign(obj, {
					exp: getExprCols(
						refMxName.current.value,
						refCol.current[0][index].value,
						refCol.current[1][index].value,
						refCol.current[2][index].value,
					),
				}),
			),
		);

		setFltrRows(() =>
			fltrRows.map((obj: any, index: any) =>
				Object.assign(obj, {
					exp: getExprRows(
						refMxName.current.value,
						refRow.current[0][index].value,
						refRow.current[1][index].value,
						refRow.current[2][index].value,
					),
				}),
			),
		);
	};

	const addFltr = (cols: boolean, cond: string) => {
		cols
			? setFltrCols(() => fltrCols.concat({ cond: cond, exp: '' }))
			: setFltrRows(() => fltrRows.concat({ cond: cond, exp: '' }));
	};

	let resCols = '';
	let resRows = '';
	let finalExp = '';
	fltrCols.forEach((item: any, index: number) => {
		index !== 0
			? (resCols = 'broadcast(' + item.cond + ',' + resCols + ',' + item.exp + ')')
			: (resCols = item.exp);
	});
	fltrRows.forEach((item: any, index: number) => {
		index !== 0
			? (resRows = 'broadcast(' + item.cond + ',' + resRows + ',' + item.exp + ')')
			: (resRows = item.exp);
	});
	finalExp = refMxName.current.value + '[' + resCols + ', ' + resRows + ']';

	useEffect(() => {
		setNewContentValue(finalExp);
	}, [finalExp]);

	function listFltr(item: any, index: any, cols: boolean): JSX.Element {
		return (
			<div key={index}>
				<label>{cols ? 'col:' : 'row:'}</label>
				<input
					ref={(el: any) =>
						cols ? (refCol.current[0][index] = el) : (refRow.current[0][index] = el)
					}
					onChange={fltrChange}
				/>
				<label>opr:</label>
				<input
					ref={(el: any) =>
						cols ? (refCol.current[1][index] = el) : (refRow.current[1][index] = el)
					}
					onChange={fltrChange}
				/>
				<label>val:</label>
				<input
					ref={(el: any) =>
						cols ? (refCol.current[2][index] = el) : (refRow.current[2][index] = el)
					}
					onChange={fltrChange}
				/>
			</div>
		);
	}

	return (
		<div>
			<label className={styles.title}>Filter Builder</label>
			<div className={styles.filterWrapper}>
				<div>
					<label>matrix:</label>
					<input
						style={{ width: '120px' }}
						ref={refMxName}
						className={styles.inpName}
						onChange={fltrChange}
					/>
				</div>

				{fltrCols.map((item: any, index: any) => listFltr(item, index, true))}

				<div>
					<button
						id={'cols'}
						className={styles.btnFilter}
						onClick={() => addFltr(true, '&')}
					>
						and
					</button>
					<button
						id={'cols'}
						className={styles.btnFilter}
						onClick={() => addFltr(true, '||')}
					>
						or
					</button>
				</div>

				{fltrRows.map((item: any, index: any) => listFltr(item, index, false))}
				<div>
					<button
						id={'rows'}
						className={styles.btnFilter}
						onClick={() => addFltr(false, '&')}
					>
						and
					</button>
					<button
						id={'rows'}
						className={styles.btnFilter}
						onClick={() => addFltr(false, '||')}
					>
						or
					</button>
				</div>
			</div>
		</div>
	);
}
