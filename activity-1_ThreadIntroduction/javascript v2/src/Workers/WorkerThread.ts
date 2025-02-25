type Dict = { [key: string]: any };
type Payload = { action: string; data: Dict };

export class Thread {
	static readonly data: Dict = {};

	// These can be static since there should only ever be one instance of them.
	// These classes exist so that inheritance can be used
	static async run(data: Dict) {
		Thread.initData(data);
		Thread.print("Hello from Worker!");

		await Thread.synchronized(async () => {
			await new Promise((resolve) => {
				Thread.print("Waiting for 5 seconds...");
				setTimeout(resolve, 1000);
			});
			Thread.print("done");
		});
		Thread.end();
	}

	static async synchronized(callback: () => Promise<void>): Promise<void> {
		// Request and wait for the key
		Thread.request("key1");
		await new Promise<void>((resolve) => {
			self.onmessage = (event) => {
				const [action, value] = [
					event.data.action,
					event.data.value,
				];

				// Catch any messages that give us the key
				if (action === "give" && value === "key1") {
					resolve();
				}

				// Fall through to default
				//onmessage(event);
			};
		});

		// Execute, release, and resolve
		await callback();
		Thread.release("key1");
	}

	/**
	 * Acts as a proxy, allowing the main thread to keep track of all state changes
	 */
	static setData(property: string, value: any) {
		Thread.data[property] = value;
		Thread.print(`Set ${property} to ${value}`);
	}

	private static readonly initData = (data: Dict) => {
		for (const [property, value] of Object.entries(data))
			Thread.setData(property, value);
	};

	/**
	 * Shorthand for printing. Supports chaining.
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

const onmessage = (event: MessageEvent) => {
	const payload: Payload = event.data;

	if (payload.action === "start") Thread.run(payload.data);
};

export function initThread() {
	self.onmessage = onmessage;
}

initThread();

export default Thread;
