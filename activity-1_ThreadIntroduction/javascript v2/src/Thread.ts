import Log from "./Log.js";
import Queue from "./Queue.js";

type Dict = { [key: string]: any };

type Key = { key: string; queue: Queue };
type KeyDict = { [key: string]: Key };

export class Thread {
	// All Threads share the same set of keys
	private static keys: KeyDict = {};

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

		if (action === "print") {
			this.log.log(value);
		}
		if (action === "request") {
			this.log.log("Requesting " + value);

			// If the key hasn't been seen before, add an entry
			if (!Thread.keys[value]) {
				Thread.keys[value] = {
					key: value,
					queue: new Queue(),
				};
			}

			// If the key is in use, wait for it to be released
			if (!Thread.keys[value].queue.isEmpty()) {
				Thread.keys[value].queue.enqueue(this.worker);
				return;
			}

			// Put the worker in the front of the line
			Thread.keys[value].queue.enqueue(this.worker);
			// Give the key
			this.worker.postMessage({ action: "give", value: value });
		}
		if (action === "release") {
			this.log.log("Releasing " + value);

			// Remove the worker from the queue so the next can have it
			Thread.keys[value].queue.dequeue();

			// Give it to the next worker (If there is one)
			Thread.keys[value].queue
				.peek()
				?.postMessage({ action: "give", value: value });
		}
	}
}

export default Thread;
