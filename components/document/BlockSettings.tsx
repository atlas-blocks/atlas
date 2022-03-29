import React, { useState } from 'react';
import styles from '../../styles/BlockSettings.module.css';
import Node from '../../commons/nodes/Node';

type Props = {
	node: Node | null;
};

function BlockSettings(props: Props) {
	const [nodeFields, setNodeFields] = useState<string[]>(
		Object.keys(props.node === null ? {} : props.node),
	);
	const openBlock = {};
	return (
		<aside id={styles.settings} style={{ right: props.node === null ? '-300px' : '0' }}>
			<h2>Block Settings</h2>
		</aside>
	);
}

export default BlockSettings;
