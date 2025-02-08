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
    stateHandler: { set: (target: any, property: string, value: State) => boolean }
    stateProxy: { value: State, lastValue: State }
    workerId: string | undefined

    constructor() {
        const stateTarget = { value: State.New, lastValue: State.New }
        this.stateHandler = {
            set: (target, _, value: State) => {
                target.lastValue = target.value
                target.value = value
                self.postMessage({ message: 'set state', value: value })
                return true
            }
        }
        this.stateProxy = new Proxy(stateTarget, this.stateHandler)
    
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
