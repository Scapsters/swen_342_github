import { Bridge } from '../SharedResource/Bridge.js'
import { WorkerController } from './WorkerController.js'
import { WoolieView } from '../View/WoolieView.js'
import { WorkerHolder } from '../Data/WorkerViewHolder.js'

export class WoolieController extends WorkerController
{
    static readonly Holder: WorkerHolder<WoolieController> = new WorkerHolder()
    static stopWorkerOnSelectedWorker() { WoolieController.Holder.get(WoolieView.getSelectedWorkerId())?.destructor() }
    static crossBridgeOnSelectedWorker() { WoolieController.Holder.get(WoolieView.getSelectedWorkerId())?.crossBridge() }

    protected workerView: WoolieView

    bridge!: Bridge // Shared Resource

    constructor(bridge: Bridge, destination: string, timeToCross: number) 
    {
        // Start worker and initialize basic properties
        super('WoolieWorker.js')
        this.workerId = WoolieController.Holder.add(this)

        // Initialize woolie specific properties
        this.setDestination(destination)
            .setTimeToCross(timeToCross)
            .bridge = bridge

        // Create the view
        this.workerView = new WoolieView(this.workerId)
            .appendElement()
            .setDestination(destination)
    }
    destructor() {
        this.workerView.removeElement()
        WoolieController.Holder.remove(this.workerId)
        this.worker.terminate()
    }

    /*
     * Controller behavior
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
    private setDestination(destination: string) { 
        return this.post('set destination', destination)
    }
    private setTimeToCross(timeToCross: number) {
        return this.post('set time to cross', timeToCross)
    }

    startMoving() { 
        return this.post('start moving')
    }
    stopMoving() { 
        return this.post('stop moving')
    }
    startWaiting() { 
        return this.post('start waiting')
    }

    post(message: string, value?: any) {
        this.worker.postMessage({ message: message, value: value })
        return this
    }
    
}