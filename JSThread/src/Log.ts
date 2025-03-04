export class Log {
	/**
	 * Logs a message to the output div
	 * @param message - Contents of log 
	 * @param header - Header of log
	 */
	public static log(message: string, header: string = "") {
		message = message
			.split(/\s+/)
			.map(word => { // Iterate through each word and apply styling if neccesary
				const color = this.colors[this.special_words[word.toLocaleLowerCase()]] || "white";
				return this.wrap_color(color, word);
			})
			.join(" ");
		document.getElementById("output")!.innerHTML += header + message + "<br>";
	}

	private readonly log_color: string;

	/**
	 * @param name - Name of the object using this log
	 */
	constructor(private readonly name: string) {
		this.log_color = `oklch(80% .23 ${(this.color_hash(name) % 12) * 30})`;
	}

	/**
	 * Logs a message to the output div with additional styling based off the name of the log.
	 * @param message - Contents of log
	 */
	public log(message: string) {
		Log.log(message, `<span style="color:${this.log_color};">${this.name}</span>: `);
	}

	private static readonly special_words: { [key: string]: string } = {
		"request": "blue",
		"requesting": "blue",
		"release": "yellow",
		"releasing": "yellow",
		"wait": "purple",
		"waiting": "purple",
		"notify": "orange",
		"notifying": "orange",
		"notifyAll": "red",
		"notifyingAll": "red",
		"acquired": "green",
		"acquiring": "green",
	};

	private static readonly colors: { [key: string]: string } = {
		blue: "oklch(80% .23 240)",
		yellow: "oklch(80% .23 60)",
		purple: "oklch(80% .23 300)",
		orange: "oklch(80% .23 30)",
		red: "oklch(80% .23 0)",
		green: "oklch(80% .23 120)",
	};

	private static wrap_color(color: string, message: string) {
		return `<span style="color:${color};">${message}</span>`;
	}

	private color_hash(string: string): number {
		return string.split("").reduce((prev, char) => prev + char.charCodeAt(0), 2); // 2 because i like the default color better
	}
}

export default Log;
