export interface Queue<T> {
	enqueue(item: T): void;
	dequeue(): T | undefined;
	size(): number;
	toArray(): T[];
}

export class ArrayQueue<T> implements Queue<T> {
	private storage: T[] = [];

	constructor(private capacity: number = Infinity) {}

	enqueue(item: T): void {
		if (this.size() === this.capacity) {
			throw Error('Queue has reached max capacity, you cannot add more items');
		}
		this.storage.push(item);
	}
	dequeue(): T {
		const removed = this.storage.shift();
		if (removed === undefined) throw new Error();
		return removed;
	}

	peek(): T {
		return this.storage[this.size() - 1];
	}

	size(): number {
		return this.storage.length;
	}

	public toArray(): T[] {
		return this.storage.slice();
	}

	toString() {
		return this.storage.toString();
	}
}
