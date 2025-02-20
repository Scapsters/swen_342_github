import { Queue } from "../Data/Queue.js";
import { WorkerController } from "../Controller/WorkerController.js";

export abstract class SharedResource<T extends WorkerController> {
	private readonly owners: T[] = [];
	private readonly capacity: number;
	private readonly queue = new Queue<T>();

	constructor(capacity: number) {
		this.capacity = capacity;
	}

	getIsLocked(): boolean {
		return this.owners.length >= this.capacity;
	}

	requestResource(user: T): void {
		this.queue.enqueue(user);
		if (!this.getIsLocked()) {
			this.startNextWorker();
		} else {
			this.holdResource(user);
		}
	}

	startNextWorker(): void {
		if (this.queue.isEmpty()) return;
		if (this.getIsLocked()) return;

		const nextWorker = this.queue.dequeue();
		if (!nextWorker) return;

		this.owners.push(nextWorker);
		this.giveResource(nextWorker);
	}

	releaseResource(workerController: T): void {
		if (this.owners.includes(workerController)) {
			this.owners.splice(this.owners.indexOf(workerController), 1);
			this.startNextWorker();
		} else {
			throw new Error(
				"Worker tried releasing shared resource it didn't own"
			);
		}
	}

	abstract giveResource(worker: T): void;
	abstract holdResource(worker: T): void;
}
