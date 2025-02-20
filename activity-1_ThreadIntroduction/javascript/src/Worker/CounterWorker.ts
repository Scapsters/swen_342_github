console.log("worker started")
import { MyWorker } from './Worker.js'
import { State } from '../Enum/State.js'

export class CounterWorker extends MyWorker {

    countIntervalId: NodeJS.Timeout | undefined

    constructor() {
        super()
        this.onMessage = this.onMessage.bind(this)

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
            if (this.getPreviousAction() === 'counting') {
                this.onMessage(new MessageEvent('message', { data: { message: 'start count' } }))
            }
            if (this.getPreviousAction() === 'stopped') {
                this.onMessage(new MessageEvent('message', { data: { message: 'end count' } }))
            }
        }
    }

    startCount() {
        this.setAction('counting')
        this.countIntervalId = setInterval(() => {
            self.postMessage({ message: 'count', value: "n/a" })
        }, 1000)
    }
}

const counterWorker = new CounterWorker();
self.onmessage = counterWorker.onMessage;
