import { nullCheck } from "./Util/Debug.js";
import { CounterController } from "./Controller/CounterController.js";
import { WoolieController } from "./Controller/WoolieController.js";
import { SharedResource } from "./SharedResource/SharedResource.js";

const bridge = new SharedResource(3, (worker: WoolieController) =>
	worker.post("cross bridge")
);

const clickEvents: [string, () => void][] = [
	["StartCounterButton", startCounterWorker],
	["StopCounterButton", CounterController.stopWorkerOnSelectedWorker],
	["StartCountButton", CounterController.startCountOnSelectedWorker],
	["StopCountButton", CounterController.stopCountOnSelectedWorker],
	["ResetCountButton", CounterController.resetCountOnSelectedWorker],
	["StartWoolieButton", startWoolieWorker],
	["StopWoolieButton", WoolieController.stopSelected],
	["CrossBridgeButton", WoolieController.crossBridge],
];
function addClickEvent(id: string, func: () => void) {
	nullCheck(document.getElementById(id), id).addEventListener("click", func);
}
for (const [id, func] of clickEvents) {
	addClickEvent(id, func);
}


function startCounterWorker() {
	new CounterController().startCount();
}
function startWoolieWorker() {
	new WoolieController(bridge, "North", 10).crossBridge();
}
