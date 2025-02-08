import { WorkerView } from './WorkerView.js'
import { nullCheck } from '../Util/Debug.js'

export class WoolieView extends WorkerView
{
    static readonly workerViewSelector = nullCheck(document.getElementById('WoolieSelector'), 'WoolieSelector') as HTMLInputElement

    displayDestination!: HTMLElement
    displayProgress!: HTMLElement

    templateId = 'WoolieTemplate'

    constructor(workerId: number) 
    {
        super(workerId, "WoolieTemplate")
        this.appendElement()
    }

    appendElement() 
    {
        // Get elements within node to control later
        this.displayProgress    = nullCheck(this.wrapper.querySelector('.progress'), 'displayProgress')
        this.displayDestination = nullCheck(this.wrapper.querySelector('.destination'), 'displayDestination')

        // Set default values
        this.displayId.innerHTML          = String(`Woolie ${this.workerId}`)
        this.displayProgress.innerHTML    = String(0)
        this.displayDestination.innerHTML = "None"
    }
}
