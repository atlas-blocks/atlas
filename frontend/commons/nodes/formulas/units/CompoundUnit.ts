import Unit from './Unit';
import UnitSystem from './UnitSystem';

interface Component {
	unit: Unit;
	multiplicity: number;
}

class CompoundUnit extends Unit {
	components: Component[];

	constructor(unitSystem: UnitSystem, name: string, components: Component[]) {
		super(unitSystem, name);
		this.components = components;
	}
}

export default CompoundUnit;
