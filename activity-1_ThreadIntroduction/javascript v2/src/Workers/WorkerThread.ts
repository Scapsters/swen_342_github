type Dict = { [key: string]: any };

export class Thread {
	static readonly data: Dict = {};

	// These can be static since there should only ever be one instance of them.
	// These classes exist so that inheritance can be used
	static run(data: Dict) {
		Thread.initData(data);
		self.postMessage({ message: "print", value: "Hello from Worker!" });
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

export function initThread(self: Window & typeof globalThis) {
	self.onmessage = (event: MessageEvent) => {
		const data = event.data;
	
		if(data.message === "run") Thread.run(data)
	};
}

initThread(self)

export default Thread