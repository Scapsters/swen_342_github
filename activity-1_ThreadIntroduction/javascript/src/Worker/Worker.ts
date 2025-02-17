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
    private readonly stateProxy: { value: State, lastValue: State }
    private readonly actionProxy: { value: string, lastValue: string }

    private workerId: string | undefined

    constructor() {
        this.stateProxy = createProxy(State.New, 'set state')
        this.actionProxy = createProxy('new', 'set action')

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

    /*
     * Setters and Getters
     */
    setState(state: State) {
        this.stateProxy.value = state
        return this
    }
    getState(): State {
        return this.stateProxy.value
    }
    getPreviousState(): State {
        return this.stateProxy.lastValue
    }

    setAction(action: string) {
        this.actionProxy.value = action
        return this
    }
    getAction(): string {
        return this.actionProxy.value
    }
    getPreviousAction(): string {
        return this.actionProxy.lastValue
    }

    getWorkerId(): string {
        return this.workerId as string
    }
}

function createProxy<T>(initialValue: T, message: string) {
    const target = { value: initialValue, lastValue: initialValue }
    const handler = {
        set: (target: any, _: any, value: T) => {
            target.lastValue = target.value
            target.value = value
            self.postMessage({ message, value })
            return true
        }
    }
    return new Proxy(target, handler)
}

const worker = new MyWorker()
self.onmessage = worker.onMessage
