import Thread from "./ThreadController.js";

function start() {
    const thread = new Thread('Worker', {})
}

document.getElementById("start")!.addEventListener("click", start);
