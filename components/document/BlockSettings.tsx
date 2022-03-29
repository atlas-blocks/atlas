import React, { useState } from 'react';
import styles from '../../styles/BlockSettings.module.css';
import Node from '../../commons/nodes/Node';

type Props = {
	node: Node | null;
};

function BlockSettings(props: Props) {
	return (
		<aside id={styles.settings} style={{ right: props.node === null ? '-300px' : '0' }}>
			<h2>Block Settings</h2>
			{
				props.node === null
					? ''
					: Object.keys(props.node).map((field) => {
						return (
							<div key={field}>
								{field + ": " + props.node[field]}
							</div>
						)})
			}
		</aside>
	);
}

export default BlockSettings;
