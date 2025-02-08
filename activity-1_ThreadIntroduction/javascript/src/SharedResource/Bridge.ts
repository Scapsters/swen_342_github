import { SharedResource } from "./SharedResource.js"
import { WoolieController } from "../Controller/WoolieController.js"

export class Bridge extends SharedResource<WoolieController> {
    giveResource(worker: WoolieController, callback: Function): void {
        worker.startMoving(callback)
    }
}
