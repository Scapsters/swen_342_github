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

		this.worker = new Worker(workerPath.href, {
			type: "module",
		});

		this.worker.onerror = (event) => console.error("Worker error", event);
		this.worker.onmessage = this.onmessage.bind(this);

		this.data = data;

		this.log = new Log(name);
	}

	private readonly worker: Worker;

	private onmessage(event: MessageEvent) {
		const data = event.data;
		const [action, value] = [data.action, data.value];

		switch (action) {
			case "print":
				this.log.log(value);
				break;
			case "request":
				this.log.log(`Requesting ${value}`);
				this.addKey(value);
				// If the key is in use, wait for it to be released
				if (!Thread.keys[value].isEmpty()) {
					Thread.keys[value].enqueue(this.worker);
					return;
				}
				Thread.keys[value].enqueue(this.worker);
				this.give(value);
				break;
			case "release":
				this.log.log(`Releasing ${value}`);
				this.addKey(value);
				Thread.keys[value].dequeue() // Remove the old worker from the queue
				this.giveTo(value, Thread.keys[value].peek());
				break;
			case "wait":
				this.addWait(value);
				Thread.waits[value].enqueue(this.worker);
				break;
			case "notify":
				this.addWait(value);
				this.notifyTo(value, Thread.waits[value].dequeue());
				break;
			case "notifyAll": {
				const queue = Thread.waits[value];
				while (!queue.isEmpty()) this.notifyTo(value, queue.dequeue());
				break;
			}
		}
	}

	/**
	 * Adds the key to keys if not present.
	 * Return is whether or not the key was added.
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
	 * Return is whether or not the wait was added.
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
