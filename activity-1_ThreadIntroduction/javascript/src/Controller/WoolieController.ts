import { WorkerController } from "./WorkerController.js";
import { WoolieView } from "../View/WoolieView.js";
import { WorkerHolder } from "../Data/WorkerViewHolder.js";
import { SharedResource } from "../SharedResource/SharedResource.js";

export class WoolieController extends WorkerController {
	static readonly Holder: WorkerHolder<WoolieController> = new WorkerHolder();
	static stopSelected() {
		WoolieController.Holder.get(
			WoolieView.getSelectedWorkerId()
		)?.destructor();
	}
	static crossBridge() {
		WoolieController.Holder.get(
			WoolieView.getSelectedWorkerId()
		)?.crossBridge();
	}

	protected workerView: WoolieView;

	protected bridge: SharedResource<WoolieController>; // Shared Resource

	constructor(
		bridge: SharedResource<WoolieController>,
		destination: string,
		timeToCross: number
	) {
		// Start worker and initialize basic properties
		super("WoolieWorker.js");
		this.workerId = WoolieController.Holder.add(this);

		// Initialize woolie specific properties
		this.post("set destination", destination);
		this.post("set time to cross", timeToCross);

		// Create the view
		this.workerView = new WoolieView(this.workerId)
			.appendElement()
			.setDestination(destination);

		this.bridge = bridge;
	}
	destructor() {
		this.workerView.removeElement();
		WoolieController.Holder.remove(this.workerId);
		this.worker.terminate();
	}

	/*
	 * Controller behavior
	 */
	crossBridge() {
		this.bridge.requestResource(this);
	}

	/*
	 * Communication from the worker
	 */
	onMessage(event: MessageEvent) {
		super.onMessage(event);
		const data: { message: string; value: string } = event.data;

		if (data.message === "increment progress") {
			this.workerView.incrementProgress();
		}
		if (data.message === "bridge crossed") {
			this.bridge.releaseResource(this);
			this.destructor();
		}
	}

	post(message: string, value?: any) {
		this.worker.postMessage({ message: message, value: value });
		return this;
	}
}
