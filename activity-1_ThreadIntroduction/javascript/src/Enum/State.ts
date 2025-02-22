export enum State {
	New,
	Runnable,
	Running,
	Blocked,
	Waiting,
	TimeWaiting,
	Terminated,
}

export function getEnumName(enumValue: State): string {
	return State[enumValue];
}
