console.log("worker started")
import { MyWorker } from './Worker.js'
import { State } from '../Enum/State.js'

export class CounterWorker extends MyWorker {

    countIntervalId: NodeJS.Timeout | undefined
    actionProxy = { value: 'new', lastValue: 'new' }

    constructor() {
        super()
        this.onMessage = this.onMessage.bind(this)

        const actionTarget = this.actionProxy
        const actionHandler = {
            set: (target: any, _: any, value: State) => {
                target.lastValue = target.value
                target.value = value
                self.postMessage({ message: 'set action', value: value })
                return true
            }
        }
        this.actionProxy = new Proxy(actionTarget, actionHandler)
    }

    onMessage(event: MessageEvent) {
        super.onMessage(event)

        const { data } = event
        console.log("worker received message", data)

        if (data.message === 'start count') 
        {
            this.setState(State.Running)
            this.setAction('counting')

            this.startCount()
        }
        if (data.message === 'end count') 
        {
            clearInterval(this.countIntervalId)
            
            this.setState(State.Waiting)
            this.setAction('not counting')
        }
        if (data.message === 'reset count') 
        {
            this.setState(State.Running)
            this.setAction('resetting')

            self.postMessage({ message: 'set count', value: 0 })
            clearInterval(this.countIntervalId)
            if (this.actionProxy.lastValue === 'counting') {
                this.onMessage(new MessageEvent('message', { data: { message: 'start count' } }))
            }
            if (this.actionProxy.lastValue === 'stopped') {
                this.onMessage(new MessageEvent('message', { data: { message: 'end count' } }))
            }
        }
    }

    startCount() {
        this.actionProxy.value = 'counting';
        this.countIntervalId = setInterval(() => {
            self.postMessage({ message: 'count', value: "n/a" })
        }, 1000)
    }

    setAction(action: string) {
        this.actionProxy.value = action
    }
}

const counterWorker = new CounterWorker();
self.onmessage = counterWorker.onMessage;