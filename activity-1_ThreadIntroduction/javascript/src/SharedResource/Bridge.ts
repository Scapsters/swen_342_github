import { SharedResource } from "./SharedResource.js"
import { WoolieController } from "../Controller/WoolieController.js"

export class Bridge extends SharedResource<WoolieController> {
    
    giveResource(worker: WoolieController): void {
        worker.startMoving()
    }

    holdResource(worker: WoolieController): void {
        worker.startWaiting()
    }
}
