const run = () => {
	self.postMessage({ message: "print", value: "Hello from Worker!" });
};

self.onmessage = (event: MessageEvent) => {
	const data = event.data;

    console.log('mefewfef')
	if (data.message === "run") run();
};
