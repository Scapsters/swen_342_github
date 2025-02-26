export class Thread {
	static readonly data: Dict = {};

	/**
	 * The main function that will be run by the worker.
	 * Should call `initData` and `end`
	 * @param data - The data passed to the worker from the main thread
	 */
	static async run(data: Dict) {
		Thread.initData(data);
		await Thread.synchronized(async () => {
			Thread.print("Acquired Key")
			await new Promise<void>(resolve => setTimeout(() => resolve(), 1000));
		})
		Thread.end()
	}

	/**
	 * Returns a promise of the execution of an arbitrary function.
	 * Execution can only happen if the key is not in use by any other worker.
	 * Otherwise, it will be queued for execution
	 * @param callback - The function to be executed
	 * @returns Promise<void> A promise that resolves when the function is executed
	 */
	static async synchronized(callback: () => Promise<void>): Promise<void> {
		// Request and wait for the key
		Thread.request("key1");
		await new Promise<void>(resolve => {
			self.onmessage = event => {
				const [action, value] = [event.data.action, event.data.value];

				// Catch any messages that give us the key
				if (action === "give" && value === "key1") resolve();

				// Fall through to default
				onmessage(event);
			};
		});

		// Execute, release, and resolve
		await callback();
		Thread.release("key1");
	}

	/**
	 * Acts as a proxy, allowing the main thread to keep track of all state changes
	 * @param property - The property to be set
	 * @param value - The value to be set
	 */
	static setData(property: string, value: any) {
		Thread.data[property] = value;
		Thread.print(`Set ${property} to ${value}`);
	}

	/**
	 * Initializes the data in the worker
	 * @param data - The data to be set
	 */
	private static readonly initData = (data: Dict) => {
		for (const [property, value] of Object.entries(data))
			Thread.setData(property, value);
	};

	/*
	 * Helper functions
	 */
	protected static print(message: string): Thread {
		self.postMessage({ action: "print", value: message });
		return Thread;
	}
	protected static end(): Thread {
		self.postMessage({ action: "end" });
		return Thread;
	}
	protected static request(key: string): Thread {
		self.postMessage({ action: "request", value: key });
		return Thread;
	}
	protected static release(key: string): Thread {
		self.postMessage({ action: "release", value: key });
		return Thread;
	}
}

/**
 * Default message handler. Can be decorated by other methods.
 * @param event - Message from the main thread
 */
const onmessage = (event: MessageEvent) => {
	const payload: Payload = event.data;
	if (payload.action === "start") Thread.run(payload.data);
};

/**
 * Initializes the worker. Needs to be called once per worker. Importing WorkerThread will do.
 */
export function initThread() {
	self.onmessage = onmessage;
}

initThread();

export default Thread;
