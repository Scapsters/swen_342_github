import { WorkerController } from "../Controller/WorkerController"

export class WorkerHolder<T extends WorkerController> {
    private readonly workerViews: { [workerId: number]: T } = {}
    private nextWorkerId = 0
    private size = 0

    getSize(): number {
        return this.size
    }

    add(worker: T): number {
        this.workerViews[this.nextWorkerId] = worker
        this.size++
        return this.nextWorkerId++
    }

    get(workerId: number): T | undefined {
        return this.workerViews[workerId]
    }

    remove(workerId: number): void {
        delete this.workerViews[workerId]
        this.size--
    }
}