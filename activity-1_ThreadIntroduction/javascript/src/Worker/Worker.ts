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
        this.stateProxy = createMessageProxy(stateTarget, 'value')

        const actionTarget = { value: 'new', lastValue: 'new' }
        this.actionProxy = createMessageProxy(actionTarget, 'value')
    
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

function createMessageProxy(target: { value: any }, name: string) {
    const handler = {
        set: (target: any, _: any, value: typeof target.value) => {
            target[name] = value
            self.postMessage({ message: `set ${name}`, value: value })
            return true
        }
    }
    return new Proxy(target, handler)
}

const worker = new MyWorker()
self.onmessage = worker.onMessage
