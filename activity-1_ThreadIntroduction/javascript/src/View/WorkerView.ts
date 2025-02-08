import { nullCheck } from "../Util/Debug.js"

export class WorkerView
{
    static readonly workerViewSelector: HTMLInputElement
    static readonly workerViewElement = nullCheck(document.getElementById('WorkerView'), 'WorkerView')
    static getSelectedWorkerId()
    {
        return parseInt(this.workerViewSelector.value)
    }

    workerId: number
    templateId: string

    /**
     * Id that is displayed. is the integer of the workerId
     */
    elementId: string
    wrapper!: HTMLElement

    element!: HTMLElement
    displayId!: HTMLElement
    displayCount!: HTMLElement
    displayState!: HTMLElement

    protected constructor(workerId: number, templateId: string) 
    {
        this.workerId = workerId
        this.templateId = templateId

        this.elementId = `${templateId} ${workerId}`
        this.createElement()
    }

    createElement() 
    {
        const threadTemplate = nullCheck(document.getElementById(this.templateId), `${this.templateId}`) as HTMLTemplateElement
        const clone = nullCheck(threadTemplate.content.cloneNode(true), 'clone')

        // Create element to wrap node
        const wrapper = document.createElement('div')
        wrapper.id = this.elementId
        wrapper.appendChild(clone)

        this.wrapper = wrapper;

        // Get elements within node to control later
        this.displayId = nullCheck(this.wrapper.querySelector('.id'), 'displayId')
        this.displayState = nullCheck(this.wrapper.querySelector('.state'), 'displayState')

        // Set default values
        this.displayId.innerHTML = String(this.elementId)

        // Add wrapper to the document
        WorkerView.workerViewElement.appendChild(this.wrapper)

        // Keep reference to the element
        this.element = nullCheck(document.getElementById(this.elementId), 'element')
    }
    removeElement() 
    {
        nullCheck(nullCheck(
            this.wrapper, 'node')
            .parentNode, 'parentNode')
            .removeChild(this.wrapper)
    }
}
