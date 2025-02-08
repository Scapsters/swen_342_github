import { MyWorker, State } from './Worker.js';

class WoolieWorker extends MyWorker {

    destination: string | undefined
    timeToDestination: number | undefined

    constructor() {
        super()
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

            this.postStartMoving()
        }
        if (data.message === 'stop moving') {
            this.setState(State.Waiting)
            this.setAction('stopped')

            this.postStopMoving()
        }
        if (data.message === 'start waiting') {
            this.setState(State.Waiting)
            this.setAction('waiting')
            
            this.startWaiting()
        }
    }

    postStartMoving() {
        self.postMessage({ message: 'start moving' })
    }
    postStopMoving() {
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
