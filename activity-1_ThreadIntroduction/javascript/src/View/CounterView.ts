import { WorkerView } from './WorkerView.js'
import { nullCheck } from '../Util/Debug.js'

export class CounterView extends WorkerView
{
    static readonly workerViewSelector = nullCheck(document.getElementById('CounterSelector'), 'CounterSelector') as HTMLInputElement

    displayCount!: HTMLElement

    constructor(workerId: number) 
    {
        super(workerId, "CounterTemplate")
        this.appendElement()
    }

    appendElement() 
    {
        // Get elements within node to control later
        this.displayCount = nullCheck(this.wrapper.querySelector('.count'), 'displayCount')

        // Set default values
        this.displayId.innerHTML = String(`Counter ${this.workerId}`)
        this.displayCount.innerHTML = String(0)
    }
}
