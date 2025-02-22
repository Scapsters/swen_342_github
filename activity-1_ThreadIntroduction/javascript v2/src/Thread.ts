import Log from "./Log.js";

export class Thread {
	private readonly worker: Worker;

	/**
	 * Worker must support "run" message
	 */
	constructor(data: any) {

		// Use a URL with import.meta.url for browser optimization
		this.worker = new Worker(
			new URL("../dist/Worker.js", import.meta.url),
			{
				type: "module",
			}
		);

		this.worker.onerror = (event) => console.error("Worker error", event);

		// Bind so that this class is used as "this" and not the worker
		this.worker.onmessage = this.onmessage.bind(this);
		this.worker.postMessage({ message: "run", value: data });
	}

	private onmessage(event: MessageEvent) {
		const data = event.data;
		console.log("main received message", data);

		if (data.message === "print") {
			Log.log(data.value);
		}
	}
}

export default Thread
