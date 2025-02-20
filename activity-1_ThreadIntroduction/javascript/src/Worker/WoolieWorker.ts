import { MyWorker, State } from "./Worker.js";
import { sleep } from "../Util/Sleep.js";

class WoolieWorker extends MyWorker {
	destination: string | undefined;
	timeToDestination: number | undefined;

	// Behaviors
	async startMoving() {
		if (this.timeToDestination === undefined) return;
		while (this.timeToDestination > 0) {
			this.timeToDestination--;
			emitProgress();
			await sleep(1000);
		}
		emitBridgeCrossed();
		this.setState(State.Terminated);
		this.setAction("stopped");
	}

	/*
	 * Communication from the controller
	 */
	onMessage(event: MessageEvent) {
		super.onMessage(event);
		const data: { message: string; value?: string | State } = event.data;

		if (data.message === "set destination") {
			this.destination = String(data.value);
		}
		if (data.message === "set time to cross") {
			this.timeToDestination = Number(data.value);
		}
		if (data.message === "start moving") {
			this.setState(State.Running);
			this.setAction("moving");

			this.startMoving();
		}
		if (data.message === "stop moving") {
			this.setState(State.Waiting);
			this.setAction("stopped");
		}
		if (data.message === "start waiting") {
			this.setState(State.Waiting);
			this.setAction("waiting");
		}
	}
}

/*
 * Communication with the controller
 */
function emitBridgeCrossed() {
	self.postMessage({ message: "bridge crossed", value: "n/a" });
}
function emitProgress() {
	self.postMessage({ message: "increment progress", value: "n/a" });
}

const woolieWorker = new WoolieWorker();
self.onmessage = woolieWorker.onMessage;
