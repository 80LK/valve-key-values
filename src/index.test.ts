import { createReadStream, ReadStream, readFileSync, readdirSync, writeFileSync } from "fs";
import { join } from "path";
import VKV from "./index.js";

// const stream = createReadStream("test.vdf")
const test_dir = "./test";
const input_tests_dir = join(test_dir, "input");
const output_tests_dir = join(test_dir, "output");
const files = readdirSync(input_tests_dir);
files.forEach(file => {
	const input = join(input_tests_dir, file);
	const output = join(output_tests_dir, file);
	const source = readFileSync(input, "utf-8");
	const object = VKV.parse(source);
	writeFileSync(output, VKV.strigify(object), "utf-8");
})

console.log("#SAMPLE TEST#");
const raw = `"Key1" "Value1"
"Key2"
{
	"Key3" "Value2"
	"Key4" "Value3"
	"Key5"
	{
		Key6 Value7
	}
}`;
interface ExampleObject extends VKV.VDFObject {
	Key1: string;
	Key2: {
		Key3: string;
		Key4: string;
		Key5: {
			Key6: string;
		}
	}
}
const parsed_object = VKV.parse<ExampleObject>(raw);
console.log("OUTPUT:\n", parsed_object);
/*
OUTPUT:
{
	Key1: 'Value1',
	Key2: {
		Key3: 'Value2',
		Key4: 'Value3',
		Key5: {
			Key6: 'Value7'
		}
	}
}
*/
parsed_object.Key2.Key4 = "Test write"
console.log("OUTPUT:\n", VKV.strigify(parsed_object));
/*
OUTPUT:
"Key1"  "Value1"
"Key2"
{
		"Key3"  "Value2"
		"Key4"  "Test write"
		"Key5"
		{
				"Key6"  "Value7"
		}
}
*/