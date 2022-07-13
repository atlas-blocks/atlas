import React from 'react';

export default function ElementsPanel() {
	const jupyterNotebookRef = React.useRef<HTMLIFrameElement>(null);
	React.useEffect(() => {
		if (jupyterNotebookRef.current === null)
			return console.assert('jupyterNotebookRef should not be null');
		jupyterNotebookRef.current.src =
			window.location.protocol +
			'//' +
			window.location.hostname +
			':8888' +
			'/notebooks/work/empty.ipynb';
	}, []);

	return (
		<div style={{ gridRow: '5/5', gridColumn: '3/11' }}>
			<iframe
				src={''}
				style={{ width: '100%', height: '100%' }}
				ref={jupyterNotebookRef}
			></iframe>
		</div>
	);
}
