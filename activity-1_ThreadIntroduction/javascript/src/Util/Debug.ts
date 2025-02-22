export function nullCheck<T>(value: T, name: string) {
	if (value === null) {
		throw new Error(`${name} is null`);
	}
	return value;
}
