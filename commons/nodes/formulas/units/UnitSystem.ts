import { Unit } from './Unit';

export class UnitSystem {
	private readonly id: string;
	private name: string;
	private baseUnits: Unit[];

	constructor(id: string, name: string, baseUnits: Unit[]) {
		this.id = id;
		this.name = name;
		this.baseUnits = baseUnits;
	}
}
