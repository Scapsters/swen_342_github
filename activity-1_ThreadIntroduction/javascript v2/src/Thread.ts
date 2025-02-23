import Log from "./Log.js";

type Dict = { [key: string]: any };

export class Thread {
	private readonly data: Dict = {};

	start() {
		this.worker.postMessage({ action: "start", data: this.data });
		return this;
	}

	/**
	 * Worker must support "run" message
	 */
	constructor(worker_class_name: string, data: Dict) {
		// Use a URL with import.meta.url for browser optimization
		const workerPath = new URL(
			`./Workers/${worker_class_name}.ts`,
			import.meta.url
		);

		this.worker = new Worker(workerPath.href, {
			type: "module",
		});

		this.worker.onerror = (event) => console.error("Worker error", event);
		this.worker.onmessage = this.onmessage;

		this.data = data;
	}

	private readonly worker: Worker;

	private onmessage(event: MessageEvent) {
		const data = event.data;

		if (data.message === "print") {
			Log.log(data.value);
		}
	}
}

export default Thread;
