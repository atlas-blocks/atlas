import React from 'react';
import JupyterUtils from '../../../src/utils/JupyterUtils';
import styles from '../../../styles/main.module.css';

export default function JupyterNotebookFlow() {
	const jupyterNotebookRef = React.useRef<HTMLIFrameElement>(null);
	React.useEffect(() => {
		if (jupyterNotebookRef.current === null)
			return console.assert('jupyterNotebookRef should not be null');
		jupyterNotebookRef.current.src =
			JupyterUtils.getBaseHref() + '/notebooks/work/notebooks/empty.ipynb';
	}, []);

	return (
		<iframe
			src={''}
			style={{ width: '100%', height: '100%' }}
			ref={jupyterNotebookRef}
		></iframe>
	);
}
