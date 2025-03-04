interface Dict {
	[key: string]: any;
}

interface KeyDict {
	[key: string]: Queue;
}

interface Payload {
	action: string;
	data: Dict;
}
