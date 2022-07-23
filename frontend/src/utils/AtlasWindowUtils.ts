import Flow from '../flows/Flow';

export default class AtlasWindowUtils {
	public flows: Flow[] = [];
	public selectedFlow = -1;
	// eslint-disable-next-line
	// @ts-ignore
	public setSelectedFlow: React.Dispatch<React.SetStateAction<number>>;

	public updateSelectedFlow(index: number) {
		this.setSelectedFlow(index);
	}

	public addFlow(flow: Flow): number {
		let flowIndex = this.flows.length;
		this.flows = this.flows.map((f, index) => {
			if (f.getId() !== flow.getId()) {
				return f;
			} else {
				flowIndex = index;
				return flow;
			}
		});
		if (!this.flows.includes(flow)) this.flows.push(flow);

		return flowIndex;
	}

	public removeById(id: string): boolean {
		const index = this.flows.findIndex((flow) => {
			return flow.getId() === id;
		});
		if (index != -1) {
			this.flows.splice(index, 1);
			return true;
		}
		return false;
	}

	public addAndSelectFlow(flow: Flow) {
		this.setSelectedFlow(this.addFlow(flow));
	}

	public clearFlows() {
		this.flows = [];
	}

	public getSelectedFlow(): Flow | null {
		if (this.selectedFlow === -1) return null;
		return this.flows[this.selectedFlow];
	}
}

export const awu = new AtlasWindowUtils();
