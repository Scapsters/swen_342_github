import Log from "./Log.js";
import Thread from "./Thread.js";

const AsyncFunction = Object.getPrototypeOf(async function() {}).constructor;

async function start() {
    const code = (document.getElementById("code") as HTMLTextAreaElement).value

    const runCode = new AsyncFunction("Thread", "Log", code);

    runCode(Thread, Log);
}

document.getElementById("start")!.addEventListener("click", start);
