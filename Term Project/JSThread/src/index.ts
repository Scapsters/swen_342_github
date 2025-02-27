import Log from "./Log.js";
import Thread from "./Thread.js";

const AsyncFunction = Object.getPrototypeOf(async function () {}).constructor;

async function start() {
	const code = (document.getElementById("code") as HTMLTextAreaElement).value;

	// Create a custom context for the user's code to be ran in
	const runCode = new AsyncFunction("Thread", "Log", code);

	// Run the code, providing it with any custom classes that are needed
	runCode(Thread, Log);
}

function clearConsole() {
	document.getElementById("output")!.innerHTML = "";
}

function clearCode() {
	(document.getElementById("code") as HTMLTextAreaElement).value = "";
}

function exampleOne() {
	(document.getElementById("code") as HTMLTextAreaElement).value = `Log.log("Hello, world!");`;
}

function exampleTwo() {
	(document.getElementById("code") as HTMLTextAreaElement).value = `const threads = [];
for(let i = 0; i < 4; i++) {
   threads.push(new Thread('WorkerThread', {}, \`Thread\${i}\`));
}

const [t1, t2, t3, t4] = threads;

t1.start().join() // Main thread will stop here
t2.start() // All 3 threads will start at once, but only one will have the key at a time.
t3.start()
t4.start()`;
}

document.getElementById("start")!.addEventListener("click", start);
document.getElementById("clearConsole")!.addEventListener("click", clearConsole);
document.getElementById("clearCode")!.addEventListener("click", clearCode);
document.getElementById("Log Example")!.addEventListener("click", exampleOne);
document.getElementById("Sync+Join Example")!.addEventListener("click", exampleTwo);