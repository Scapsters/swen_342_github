import Log from "./Log.js";
import Thread from "./Thread.js";

function start() {
    const code = (document.getElementById("code") as HTMLTextAreaElement).value

    const runCode = new Function("Thread", "Log", code);

    runCode(Thread, Log);
}

document.getElementById("start")!.addEventListener("click", start);
