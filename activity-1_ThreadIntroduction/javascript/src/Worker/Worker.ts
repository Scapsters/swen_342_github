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
<<<<<<< HEAD
        const stateTarget = { value: State.New, lastValue: State.New }
        this.stateProxy = createMessageProxy(stateTarget, 'value')

        const actionTarget = { value: 'new', lastValue: 'new' }
        this.actionProxy = createMessageProxy(actionTarget, 'value')
    
=======
        this.stateProxy = createProxy(State.New, 'set state')
        this.actionProxy = createProxy('new', 'set action')

>>>>>>> 0fe9c36ddca91f0386e16fd42e227b1efb1dda29
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

<<<<<<< HEAD
function createMessageProxy(target: { value: any }, name: string) {
    const handler = {
        set: (target: any, _: any, value: typeof target.value) => {
            target[name] = value
            self.postMessage({ message: `set ${name}`, value: value })
=======
function createProxy<T>(initialValue: T, message: string) {
    const target = { value: initialValue, lastValue: initialValue }
    const handler = {
        set: (target: any, _: any, value: T) => {
            target.lastValue = target.value
            target.value = value
            self.postMessage({ message, value })
>>>>>>> 0fe9c36ddca91f0386e16fd42e227b1efb1dda29
            return true
        }
    }
    return new Proxy(target, handler)
}

const worker = new MyWorker()
self.onmessage = worker.onMessage
