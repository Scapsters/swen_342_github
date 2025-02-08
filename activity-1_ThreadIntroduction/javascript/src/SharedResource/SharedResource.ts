import { Queue } from '../Data/Queue.js'
import { WorkerController } from '../Controller/WorkerController.js'

export abstract class SharedResource<T extends WorkerController> {
    isLocked = false
    private readonly queue = new Queue<T>()
    
    requestResource(user: T): void {
        this.queue.enqueue(user)
        if(!this.isLocked) {
            this.startNextWorker()
        }
    }

    startNextWorker(): void {
        if(this.queue.isEmpty()) return
        if(this.isLocked) return
        this.isLocked = true

        const callback = () => {
            this.isLocked = false
            this.startNextWorker()
        }

        const nextWorker = this.queue.dequeue()
        if(!nextWorker) return
        this.giveResource(nextWorker, callback.bind(this))
    }

    abstract giveResource(worker: T, callback: Function): void
}