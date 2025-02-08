export class SharedResourceUser {

    behavior: Function

    constructor(behavior: Function) {
        this.behavior = behavior
    }

    access(callback: () => void): void {
        this.behavior(callback)
    }
}