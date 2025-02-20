import { State } from "../Enum/State.js"
import { WorkerView } from "../View/WorkerView.js"
import { WorkerHolder } from "../Data/WorkerViewHolder.js"

export abstract class WorkerController
{
    static readonly Holder: WorkerHolder<WorkerController> = new WorkerHolder()

    protected abstract workerView: WorkerView
    
    protected worker: Worker
    protected workerId: number

    /**
     * Use the proxy to edit
     */
    protected stateProxy: { value: State }

    protected constructor(filename: string)
    {
        // Init worker, add to static storage
        const url = new URL(`./../Worker/${filename}`, import.meta.url)
        console.log(url.href)
        this.worker = new Worker(new URL(`./../Worker/${filename}`, import.meta.url), { type: 'module' });

        // Add error event listener to handle loading errors
        this.worker.onerror = (error) => {
            console.error(`Failed to load worker script: ../Worker/${filename}`);
            console.log(error.message)
            throw new Error(`Failed to load worker script: ../Worker/${filename}`);
        };

        this.worker.onmessage = this.onMessage
        this.workerId = WorkerController.Holder.add(this)

        // Initiate isCounting listener
        const target = { value: State.New }

        // Do not assign workerView here since workerView is protected

        const stateHandler = {
            set: (target: { value: State }, _: string, value: State) => {
                console.log("state changed", value)
                target.value = value
                this.workerView.setState(value)
                return true
            }
        };
        this.stateProxy = new Proxy(target, stateHandler) 
    }
    destructor() 
    {
        this.workerView.removeElement()
        WorkerController.Holder.remove(this.workerId)
        this.worker.terminate()
    }

    onMessage(event: MessageEvent) 
    {
        const data: { message: string, value?: string | State } = event.data
        console.log("main received message", data)

        if (data.message === 'set state') {
            if (data.value === undefined) {
                throw new Error("value is undefined")
            }
            if (typeof data.value === 'string') {
                throw new Error("value is string, should be state")
            }
            this.setState(data.value)
        }
    }

    setState(state: State) {
        this.stateProxy.value = state
        return this
    }
}
