import { Queue } from '../Data/Queue.js'
import { WorkerController } from '../Controller/WorkerController.js'

export abstract class SharedResource<T extends WorkerController> {
    isLocked = false
    owner: T | null = null
    private readonly queue = new Queue<T>()
    
    requestResource(user: T): void {
        this.queue.enqueue(user)
        if(!this.isLocked) {
            this.startNextWorker()
        } else {
            this.holdResource(user)
        }
    }

    startNextWorker(): void {
        if(this.queue.isEmpty()) return
        if(this.isLocked) return
        this.isLocked = true

        const nextWorker = this.queue.dequeue()
        if(!nextWorker) return

        this.owner = nextWorker
        this.giveResource(nextWorker)
    }

    releaseResource(WorkerController: T): void {
        if(this.owner === WorkerController) {
            this.owner = null
            this.isLocked = false
            this.startNextWorker()
        }
        else {
            throw new Error("Worker tried releasing shared resource it didn't own")
        }
    }

    abstract giveResource(worker: T): void
    abstract holdResource(worker: T): void
}
