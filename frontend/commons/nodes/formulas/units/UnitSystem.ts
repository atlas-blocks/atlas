import Unit from './Unit';

class UnitSystem {
	private readonly id: string;
	private readonly name: string;
	private readonly baseUnits: Unit[];

	constructor(id: string, name: string, baseUnits: Unit[]) {
		this.id = id;
		this.name = name;
		this.baseUnits = baseUnits;
	}
}

export default UnitSystem;
