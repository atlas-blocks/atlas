import { ConstantNode } from '../nodes/formulas/values/ConstantNode';

export interface Namespace {
	package: string;

	getConstants: () => ConstantNode[];
}
