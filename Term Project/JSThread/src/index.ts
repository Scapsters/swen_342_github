import Log from "./Log.js";
import Thread from "./Thread.js";

const AsyncFunction = Object.getPrototypeOf(async function() {}).constructor;

async function start() {
    const code = (document.getElementById("code") as HTMLTextAreaElement).value

    // Create a custom context for the user's code to be ran in
    const runCode = new AsyncFunction("Thread", "Log", code);

    // Run the code, providing it with any custom classes that are needed
    runCode(Thread, Log);
}

document.getElementById("start")!.addEventListener("click", start);
