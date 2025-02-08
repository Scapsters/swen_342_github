console.log("worker started")

export enum State {
    New,
    Runnable,
    Running,
    Blocked,
    Waiting,
    TimeWaiting,
    Terminated
}

export class MyWorker {
    stateProxy: { value: State, lastValue: State }
    actionProxy: { value: string, lastValue: string }

    workerId: string | undefined

    constructor() {
        const stateTarget = { value: State.New, lastValue: State.New }
        const stateHandler = {
            set: (target: any, _: any, value: State) => {
                target.lastValue = target.value
                target.value = value
                self.postMessage({ message: 'set state', value: value })
                return true
            }
        }
        this.stateProxy = new Proxy(stateTarget, stateHandler)

        const actionTarget = { value: 'new', lastValue: 'new' }
        const actionHandler = {
            set: (target: any, _: any, value: string) => {
                target.lastValue = target.value
                target.value = value
                self.postMessage({ message: 'set action', value: value })
                return true
            }
        }
        this.actionProxy = new Proxy(actionTarget, actionHandler)
    
        this.onMessage = this.onMessage.bind(this)
    }

    onMessage(event: MessageEvent): void {
        const { data } = event as { data: { message: string, workerId?: string } }
        console.log("worker received message", data)
    
        if (data.message === 'set workerId') 
        {
            this.workerId = data.workerId
        }
    }

    setState(state: State) {
        this.stateProxy.value = state
    }
}
const worker = new MyWorker()
self.onmessage = worker.onMessage
