import { MutableRefObject } from 'react';

interface Globals {
	selectedBlock: Element | null;
	inputElemRef: MutableRefObject<any> | null;
}
let globals: Globals = {
	selectedBlock: null,
	inputElemRef: null,
};

export default globals;
