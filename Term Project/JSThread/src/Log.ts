export class Log {
	public static log(message: string) {
		document.getElementById("output")!.innerHTML += message + "<br>";
	}

	constructor(private readonly name: string) {}

	public log(message: string) {
		Log.log(`${this.name}: ${message}`);
	}
}

export default Log;
