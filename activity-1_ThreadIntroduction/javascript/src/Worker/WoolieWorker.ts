import { MyWorker, State } from './Worker.js';

class WoolieWorker extends MyWorker {

    actionProxy = { value: 'new', lastValue: 'new' }

    destination: string | undefined
    timeToDestination: number | undefined

    constructor() {
        super()

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

        if (data.message === 'set destination') {
            this.destination = data.destination
        }
        if (data.message === 'set time to cross') {
            this.timeToDestination = data.timeToDestination
        }
        if (data.message === 'start moving') {
            this.setState(State.Running)
            this.setAction('moving')

            this.startMoving()
        }
        if (data.message === 'stop moving') {
            this.setState(State.Waiting)
            this.setAction('stopped')

            this.stopMoving()
        }
        if (data.message === 'start waiting') {
            this.setState(State.Waiting)
            this.setAction('waiting')
            
            this.startWaiting()
        }
    }

    startMoving() {
        self.postMessage({ message: 'start moving' })
    }
    stopMoving() {
        self.postMessage({ message: 'stop moving' })
    }
    startWaiting() {
        self.postMessage({ message: 'start waiting' })
    }

    setAction(action: string) {
        this.actionProxy.value = action
    }

}
const woolieWorker = new WoolieWorker();
self.onmessage = woolieWorker.onMessage;
