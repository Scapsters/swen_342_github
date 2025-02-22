import { WorkerHolder } from "../Data/WorkerViewHolder.js";
import { CounterView } from "../View/CounterView.js";
import { WorkerController } from "./WorkerController.js";

export class CounterController extends WorkerController {
	static readonly Holder: WorkerHolder<CounterController> =
		new WorkerHolder();
	static stopWorkerOnSelectedWorker() {
		CounterController.Holder.get(
			CounterView.getSelectedWorkerId()
		)?.destructor();
	}
	static startCountOnSelectedWorker() {
		CounterController.Holder.get(
			CounterView.getSelectedWorkerId()
		)?.startCount();
	}
	static stopCountOnSelectedWorker() {
		CounterController.Holder.get(
			CounterView.getSelectedWorkerId()
		)?.stopCount();
	}
	static resetCountOnSelectedWorker() {
		CounterController.Holder.get(
			CounterView.getSelectedWorkerId()
		)?.resetCount();
	}

	workerView: CounterView;

	constructor() {
		super("CounterWorker.js");
		this.worker.onmessage = this.onMessage.bind(this);
		this.workerId = CounterController.Holder.add(this);

		this.workerView = new CounterView(this.workerId);
		this.workerView.appendElement();
	}
	destructor() {
		this.workerView.removeElement();
		CounterController.Holder.remove(this.workerId);
		this.worker.terminate();
	}

	onMessage(event: MessageEvent) {
		super.onMessage(event);
		const data: { message: string; value: string } = event.data;

		const displayCount = this.workerView.displayCount;

		if (data.message === "count") {
			const incrementedValue = parseInt(displayCount.innerHTML) + 1;
			displayCount.innerHTML = String(incrementedValue);
		}
		if (data.message === "set count") {
			displayCount.innerHTML = data.value;
		}
	}

	startCount() {
		this.worker.postMessage({ message: "start count" });
	}
	stopCount() {
		this.worker.postMessage({ message: "end count" });
	}
	resetCount() {
		this.worker.postMessage({ message: "reset count" });
	}
}
