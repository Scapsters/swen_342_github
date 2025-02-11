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

    constructor(bridge: Bridge, destination: string, timeToCross: number) 
    {
        // Start worker and initialize basic properties
        super('WoolieWorker.js')
        this.worker.onmessage = this.onMessage.bind(this)
        this.workerId = WoolieController.Holder.add(this)

        // Initialize woolie specific properties
        this.bridge = bridge
        this.setDestination(destination)
        this.setTimeToCross(timeToCross)

        // Create the view
        this.workerView = new WoolieView(this.workerId)
        this.workerView.appendElement()
        this.workerView.setDestination(destination)
    }
    destructor() {
        this.workerView.removeElement()
        WoolieController.Holder.remove(this.workerId)
        this.worker.terminate()
    }


    /*
     * Behavior
     */
    crossBridge()     { this.bridge.requestResource(this) }

    /*
     * Communication from the worker
     */
    onMessage(event: MessageEvent) 
    {
        super.onMessage(event)
        const data: { message: string, value: string } = event.data

        if(data.message === 'increment progress') {
            this.workerView.incrementProgress()
        }
        if(data.message === 'bridge crossed') {
            this.bridge.releaseResource(this)
            this.destructor()
        }
    }

    /*
     * Communication with the worker
     */
    private setDestination(destination: string) { this.worker.postMessage({ message: 'set destination', value: destination }) }
    private setTimeToCross(timeToCross: number) { this.worker.postMessage({ message: 'set time to cross', value: timeToCross }) }

    startMoving()     { this.worker.postMessage({ message: 'start moving' }) }
    stopMoving()      { this.worker.postMessage({ message: 'end moving' }) }
    startWaiting()    { this.worker.postMessage({ message: 'start waiting' }) }
    
}