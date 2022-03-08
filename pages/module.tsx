import ReactFlow from 'react-flow-renderer';
import { NextPage } from 'next';
import styles from '../styles/Module.module.css';
import Navbar from '../components/includes/navbar';

const elements = [
	{ id: '1', data: { label: 'Node 1' }, position: { x: 250, y: 5 } },
	{ id: '2', data: { label: 'Node 2' }, position: { x: 100, y: 100 } },
	{ id: 'e1-2', source: '1', target: '2', animated: true },
];

const flowStyles = { height: 500 };

const BasicFlow = () => <ReactFlow elements={elements} style={flowStyles} />;


const Module: NextPage = () => {
	return (
		<div>
			<div id={styles.blocks_menu}>
				<h2>Menu</h2>
			</div>
			<div id={styles.blocks_canvas}>
				<ReactFlow elements={elements} style={flowStyles} />
			</div>
			<div id={styles.blocks_settings}>
				<h2>Settings</h2>
			</div>
		</div>
	);
};

export default Module;
