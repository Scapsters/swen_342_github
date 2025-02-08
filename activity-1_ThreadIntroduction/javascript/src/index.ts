import { nullCheck } from './Util/Debug.js'
import { Bridge } from './SharedResource/Bridge.js'
import { CounterController } from './Controller/CounterController.js'
import { WoolieController } from './Controller/WoolieController.js'

const bridge = new Bridge()

const clickEvents: [string, () => void][] = 
[
    [ 'StartCounterButton',   startCounterWorker ],
    [ 'StopCounterButton',    CounterController.stopWorkerOnSelectedWorker ],
    [ 'StartCountButton',     CounterController.startCountOnSelectedWorker ],
    [ 'StopCountButton',      CounterController.stopCountOnSelectedWorker ],
    [ 'ResetCountButton',     CounterController.resetCountOnSelectedWorker ],
    [ 'StartWoolieButton',    startWoolieWorker ],
    [ 'StopWoolieButton',     WoolieController.stopWorkerOnSelectedWorker ],
    [ 'CrossBridgeButton',    WoolieController.crossBridgeOnSelectedWorker ],
]
for (const [id, func] of clickEvents) 
{
    addClickEvent(id, func)
}
function addClickEvent(id: string, func: () => void) 
{
    nullCheck(document.getElementById(id), id)
        .addEventListener('click', func)
}


function startCounterWorker() 
{
    new CounterController().startCount()
}
function startWoolieWorker() 
{
    new WoolieController(bridge, 'North', 10).crossBridge()
}
