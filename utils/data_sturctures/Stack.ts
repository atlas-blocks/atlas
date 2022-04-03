interface Stack<T> {
	push(item: T): void;
	pop(): T | undefined;
	peek(): T | undefined;
	size(): number;
}

export class ArrayStack<T> implements Stack<T> {
	private storage: T[] = [];

	constructor(private capacity: number = Infinity) {}

	push(item: T): void {
		if (this.size() === this.capacity) {
			throw Error('Stack has reached max capacity, you cannot add more items');
		}
		this.storage.push(item);
	}

	pop(): T {
		if (this.size() === 0) throw new Error();
		const removed = this.storage.pop();
		if (removed === undefined) throw new Error();
		return removed;
	}

	peek(): T {
		if (this.size() === 0) throw new Error();
		return this.storage[this.size() - 1];
	}

	size(): number {
		return this.storage.length;
	}

	isEmpty(): boolean {
		return this.size() === 0;
	}
}
