import UnitSystem from './UnitSystem';

class Unit {
	private readonly unitSystem: UnitSystem;
	private name: string;

	constructor(unitSystem: UnitSystem, name: string) {
		this.unitSystem = unitSystem;
		this.name = name;
	}
}

export default Unit;
