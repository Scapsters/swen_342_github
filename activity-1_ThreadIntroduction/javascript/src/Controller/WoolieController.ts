import { Bridge } from '../SharedResource/Bridge.js'
import { WorkerController } from './WorkerController.js'
import { WoolieView } from '../View/WoolieView.js'
import { WorkerHolder } from '../Data/WorkerViewHolder.js'

export class WoolieController extends WorkerController
{
    static readonly Holder: WorkerHolder<WoolieController> = new WorkerHolder()
    static stopWorkerOnSelectedWorker() { WoolieController.Holder.get(WoolieView.getSelectedWorkerId())?.destructor() }
    static crossBridgeOnSelectedWorker() { WoolieController.Holder.get(WoolieView.getSelectedWorkerId())?.crossBridge() }

    workerView: WoolieView

    bridge: Bridge // Shared Resource
    bridgeCallback: Function = () => { } // This will be set when the worker starts moving, and called later when the worker stops moving

    constructor(bridge: Bridge, destination: string, timeToCross: number) 
    {
        super('WoolieWorker.js')
        this.worker.onmessage = this.onMessage.bind(this)
        this.workerId = WoolieController.Holder.add(this)

        this.bridge = bridge
        this.setDestination(destination)
        this.setTimeToCross(timeToCross)

        this.workerView = new WoolieView(this.workerId)
        this.workerView.appendElement()
    }
    destructor() {
        this.workerView.removeElement()
        WoolieController.Holder.remove(this.workerId)
        this.worker.terminate()
    }

    onMessage(event: MessageEvent) 
    {
        super.onMessage(event)
        const data: { message: string, value: string } = event.data

        const displayCount = this.workerView.displayCount

        if (data.message === 'count') {
            displayCount.innerHTML = String(parseInt(displayCount.innerHTML) + 1)
        }
        if (data.message === 'set count') {
            displayCount.innerHTML = data.value
        }
    }

    private setDestination(destination: string) { this.worker.postMessage({ message: 'set destination', value: destination }) }
    private setTimeToCross(timeToCross: number) { this.worker.postMessage({ message: 'set time to cross', value: timeToCross }) }

    startMoving(callback: Function)     { this.worker.postMessage({ message: 'start moving' }); this.bridgeCallback = callback }
    stopMoving()                        { this.worker.postMessage({ message: 'end moving' }); this.bridgeCallback() }
      
    crossBridge()                       { this.bridge.requestResource(this) }
}

