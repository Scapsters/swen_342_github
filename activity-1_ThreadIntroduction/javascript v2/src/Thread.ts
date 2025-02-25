import Log from "./Log.js";
import Queue from "./Queue.js";

type Dict = { [key: string]: any };

type KeyDict = { [key: string]: Queue };

export class Thread {
	// All Threads share the same set of keys
	private static keys: KeyDict = {};
	// All Threads share the same set of waits
	private static waits: KeyDict = {};

	private readonly data: Dict = {};

	private readonly log: Log;

	start() {
		this.worker.postMessage({ action: "start", data: this.data });
		return this;
	}

	/**
	 * Returns a promise that resolves when the thread ends.
	 * This must be `await`ed in order to properly pause the main thread
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
	 * Worker must support "run" message
	 */
	constructor(worker_class_name: string, data: Dict, name: string) {
		// Use a URL with import.meta.url for browser optimization
		const workerPath = new URL(
			`./Workers/${worker_class_name}.ts`,
			import.meta.url
		);

		// Initiaize worker and worker properties
		this.worker = new Worker(workerPath.href, {
			type: "module",
		});
		this.worker.onerror = (event) => console.error("Worker error", event);
		this.worker.onmessage = this.onmessage.bind(this);

		this.data = data; // This will be passed to the worker upon start

		this.log = new Log(name); // Create a log to append the threads name to all messages
	}

	private readonly worker: Worker;

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
				Thread.keys[value].dequeue()
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
	 * Returns whether the key was added
	 */
	addKey(key: string): boolean {
		if (!Thread.keys[key]) {
			Thread.keys[key] = new Queue();
			return true;
		}
		return false;
	}

	/**
	 * Adds the wait to waits if not present.
	 * Returns whether the wait was added
	 */
	addWait(wait: string): boolean {
		if (!Thread.waits[wait]) {
			Thread.waits[wait] = new Queue();
			return true;
		}
		return false;
	}

	/**
	 * Gives the worker the specified key
	 */
	give(key: string) {
		this.worker.postMessage({ action: "give", value: key });
	}

	/**
	 * Gives the specified worker the specified key
	 */
	giveTo(key: string, worker: Worker | undefined) {
		worker?.postMessage({ action: "give", value: key });
	}

	/**
	 * Notified the specified worker about the specified key
	 */
	notifyTo(wait: string, worker: Worker | undefined) {
		worker?.postMessage({ action: "notify", value: wait });
	}
}

export default Thread;
