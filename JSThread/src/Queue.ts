export class Queue {
	private readonly queue: Worker[] = [];

	public enqueue(item: Worker) {
		this.queue.push(item);
	}

	public dequeue(): Worker | undefined {
		return this.queue.shift();
	}

	public isEmpty(): boolean {
		return this.queue.length === 0;
	}

	public peek(): Worker {
		return this.queue[0];
	}
}

export default Queue;
