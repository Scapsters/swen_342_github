export class Log {
    public static log(message: string) {
        document.getElementById("output")!.innerHTML += message + "<br>";
    }
}

export default Log