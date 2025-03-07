import Log from "./Log.js";
import Queue from "./Queue.js";
import CounterThreadURL from './Workers/CounterThread?worker&url';
import WorkerThreadURL from './Workers/WorkerThread?worker&url';

export class Thread {
	// All Threads share the same set of keys
	private static keys: KeyDict = {};
	// All Threads share the same set of waits
	private static waits: KeyDict = {};

	private readonly data: Dict = {};

	private readonly log: Log;

	/**
	 * Send the start message to a worker. This should only be called once per Thread.
	 * @returns Thread
	 */
	start() {
		this.worker.postMessage({ action: "start", data: this.data });
		return this;
	}

	/**
	 * This must be `await`ed in order to pause the main thread.
	 * @returns Promise<void> A promise that resolves when the thread ends
	 */
	join() {
		return new Promise<void>((resolve) => {
			this.worker.onmessage = (event: MessageEvent) => {
				// Intercept any "ends"
				if (event.data.action === "end") {
					resolve();
				}
				// Otherwise provide to default onmessage
				this.onmessage(event);
			};
		});
	}

	/**
	 * @param worker_class_name - Filename of the worker
	 * @param data - Data to be passed to the worker
	 * @param name - For logging purposes
	 */
	constructor(worker_class_name: string, data: Dict, name: string = "Thread") {

		// Dynamically creating URLs will trigger a Vite bug. This is a workaround.
		const workerFactories: Dict = {
			"WorkerThread": this.createWorkerThread,
			"CounterThread": this.createCounterThread,
		}

		// Initiaize worker and worker properties
		this.worker = workerFactories[worker_class_name]();
		this.worker.onerror = (event) => console.error("Worker error", event);
		this.worker.onmessage = this.onmessage.bind(this);

		this.data = data; // This will be passed to the worker upon start

		this.log = new Log(name); // Create a log to append the threads name to all messages
	}

	/**
	 * @returns Worker
	 */
	private createCounterThread() {
		const workerPath = new URL(CounterThreadURL, import.meta.url);
		return new Worker(workerPath, {
			type: "module",
		});
	}

	/**
	 * @returns Worker
	 */
	private createWorkerThread() {
		const workerPath = new URL(WorkerThreadURL, import.meta.url);
		return new Worker(workerPath, {
			type: "module",
		});
	}

	private readonly worker: Worker;

	/**
	 * Handles messages from the worker. Can be decorated by other methods.
	 * @param event - Message from worker
	 */
	private onmessage(event: MessageEvent) {
		const data = event.data;
		const [action, value] = [data.action, data.value];

		switch (action) {
			case "print":
				this.log.log(value);
				break;

			// If the key is available, queue the worker and give it. Otherwise, just queue
			case "request":
				this.log.log(`Requesting ${value}`);
				this.addKey(value);
				if (!Thread.keys[value].isEmpty()) {
					Thread.keys[value].enqueue(this.worker);
				} else {
					Thread.keys[value].enqueue(this.worker);
					this.give(value);
				}
				break;

			// Remove the worker at the front and give it to the next
			case "release":
				this.log.log(`Releasing ${value}`);
				this.addKey(value);
				Thread.keys[value].dequeue();
				this.giveTo(value, Thread.keys[value].peek());
				break;

			// Add worker to the wait list
			case "wait":
				this.addWait(value);
				Thread.waits[value].enqueue(this.worker);
				break;

			// Notify the first worker in the wait list
			case "notify":
				this.addWait(value);
				this.notifyTo(value, Thread.waits[value].dequeue());
				break;

			// Notify all workers in the wait list
			case "notifyAll": {
				const queue = Thread.waits[value];
				while (!queue.isEmpty()) this.notifyTo(value, queue.dequeue());
				break;
			}
		}
	}

	/**
	 * Adds the key to keys if not present.
	 * @param key Name of key
	 * @returns Whether the key was added
	 */
	private addKey(key: string): boolean {
		if (!Thread.keys[key]) {
			Thread.keys[key] = new Queue();
			return true;
		}
		return false;
	}

	/**
	 * Adds the wait to waits if not present.
	 * @param wait Name of wait
	 * @returns Wether the wait was added
	 */
	private addWait(wait: string): boolean {
		if (!Thread.waits[wait]) {
			Thread.waits[wait] = new Queue();
			return true;
		}
		return false;
	}

	/**
	 * Gives the worker the specified key
	 * @param key Name of key
	 */
	private give(key: string) {
		this.worker.postMessage({ action: "give", value: key });
	}

	/**
	 * Gives the specified worker the specified key
	 * @param key Name of key
	 * @param worker Worker to give the key to
	 */
	private giveTo(key: string, worker: Worker | undefined) {
		worker?.postMessage({ action: "give", value: key });
	}

	/**
	 * Notify a worker of a wait
	 * @param wait Name of wait
	 * @param worker Worker to notify
	 */
	private notifyTo(wait: string, worker: Worker | undefined) {
		worker?.postMessage({ action: "notify", value: wait });
	}
}

export default Thread;
