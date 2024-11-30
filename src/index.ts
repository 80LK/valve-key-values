namespace VKV {
	enum TokenType {
		ObjectOpen = "object_open",
		ObjectClose = "object_close",
		String = "string",
		Word = "word"
	}

	interface Token {
		type: TokenType,
		value: string;
	}

	function tokenizer(input: string): Token[] {
		let current = 0;
		const tokens: Token[] = [];
		const length = input.length;

		while (current < length) {
			let char = input[current];

			if (char === "{") {
				tokens.push({ type: TokenType.ObjectOpen, value: char });
				current++;
				continue;
			}
			if (char === "}") {
				tokens.push({ type: TokenType.ObjectClose, value: char });
				current++;
				continue;
			}

			if (char === '"') {
				let value = "";
				let escape = false;
				char = input[++current];
				while (char !== '"' || escape) {
					if (char == "\\" && !escape) {
						escape = true;
						char = input[++current];
						continue;
					}
					value += char;
					char = input[++current];
					escape = false;
				}
				current++;
				tokens.push({ type: TokenType.String, value });
				continue;
			}

			if (/[\d\w]/.test(char)) {
				// if it's a number or a word character
				let value = "";
				while (/[\d\w]/.test(char)) {
					value += char;
					char = input[++current];
				}
				tokens.push({ type: TokenType.Word, value })
				continue;
			}

			if (/\s/.test(char)) {
				current++;
				continue;
			}

			throw new Error("Unexpected character: " + char);
		}

		return tokens;
	}

	type VDFValue<T> = Record<string, string | T>
	export interface VDFObject extends VDFValue<VDFObject> { }

	function parser(tokens: Token[]) {
		if (!tokens.length) {
			throw new Error("Nothing to parse. Exiting!");
		}
		let current = 0;

		function advance() {
			return tokens[current++];
		}

		const root: VDFObject = {};

		function parseKey() {
			const token = advance();
			switch (token.type) {
				case TokenType.String:
				case TokenType.Word:
					return token.value
				default:
					throw new Error(`Unexpected token type: ${token.type}`);
			}
		}

		function parseValue() {
			const token = advance();
			switch (token.type) {
				case TokenType.String:
				case TokenType.Word:
					return token.value
				case TokenType.ObjectOpen:
					const obj: any = {};
					while (tokens[current].type != TokenType.ObjectClose) {
						const [key, value] = parsePair();
						obj[key] = value;
					}
					current++;
					return obj;
				default:
					throw new Error(`Unexpected token type: ${token.type}`);
			}
		}


		function parsePair() {
			let key = parseKey();
			let value = parseValue();
			return [key, value];
		}

		while (tokens[current]) {
			const [key, value] = parsePair();
			root[key] = value;
		}

		return root;
	}

	export function parse<T extends VDFObject>(input: string): T {
		const tokens = tokenizer(input);
		return <T>parser(tokens);
	}

	export function strigify(root: VDFObject): string {
		let output = "";

		function stringifyString(value: string) {
			return `"${value.replace(/\"/g, (match) => {
				return `\\${match}`;
			})}"`;
		}

		function strigifyObject(root: VDFObject, nested: number = 1) {
			let output = "".padStart(nested - 1, "\t") + "{\n";
			for (const key in root) {
				output += "".padStart(nested, "\t") + `${stringifyString(key)}`;
				const value = root[key];
				if (typeof value == "string")
					output += `\t${stringifyString(value)}\n`;
				else
					output += `\n${strigifyObject(value, nested + 1)}\n`
			}
			output += "".padStart(nested - 1, "\t") + "}";
			return output;
		}

		for (const key in root) {
			output += `${stringifyString(key)}`;
			const value = root[key];
			if (typeof value == "string")
				output += `\t${stringifyString(value)}\n`;
			else
				output += `\n${strigifyObject(value)}\n`
		}
		return output;
	}
}

export default VKV;
