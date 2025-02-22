import Log from "./Log.js";

export class Thread {
	run() {
		this.worker.postMessage({ message: "run" });
	}

	/**
	 * Worker must support "run" message
	 */
	constructor(worker_class_name: string, data: any) {
		// Use a URL with import.meta.url for browser optimization
		this.worker = new Worker(
			new URL(`../dist/${worker_class_name}.js`, import.meta.url),
			{
				type: "module",
			}
		);

		this.worker.onerror = (event) => console.error("Worker error", event);
		this.worker.onmessage = this.onmessage.bind;
	}

	private readonly worker: Worker;

	private onmessage(event: MessageEvent) {
		const data = event.data;
		console.log("main received message", event);

		if (data.message === "print") {
			Log.log(data.value);
		}
	}
}

export default Thread;
