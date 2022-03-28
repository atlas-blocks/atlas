import { Unit } from './Unit';
import { UnitSystem } from './UnitSystem';

interface Component {
	unit: Unit;
	multiplicity: number;
}

export class CompoundUnit extends Unit {
	components: Component[];

	constructor(unitSystem: UnitSystem, name: string, components: Component[]) {
		super(unitSystem, name);
		this.components = components;
	}
}
