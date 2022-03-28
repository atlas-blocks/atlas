import ConstantNode from '../nodes/formulas/values/ConstantNode';

interface Namespace {
	package: string;

	getConstants: () => ConstantNode[];
}

export default Namespace;
