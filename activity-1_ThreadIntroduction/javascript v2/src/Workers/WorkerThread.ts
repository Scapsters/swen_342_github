type Dict = { [key: string]: any };
type Payload = { action: string, data: Dict };

export class Thread {
	static readonly data: Dict = {};

	// These can be static since there should only ever be one instance of them.
	// These classes exist so that inheritance can be used
	static run(data: Dict) {
		Thread.initData(data);
		self.postMessage({ message: "print", value: "Hello from Worker!" });
		self.postMessage({ message: "end" });
	};

	/**
	 * Acts as a proxy, allowing the main thread to keep track of all state changes
	 */
	static setData(property: string, value: any) {
		Thread.data[property] = value;
		self.postMessage({
			message: "print",
			value: `Set ${property} to ${value}`,
		});
	}

	private static readonly initData = (data: Dict) => {
		for (const [property, value] of Object.entries(data))
			Thread.setData(property, value);
	};
}

export function initThread() {
	self.onmessage = (event: MessageEvent) => {
		const payload: Payload = event.data;

		console.log(payload)
		if(payload.action === "start") Thread.run(payload.data)
	};
}

initThread()

export default Thread