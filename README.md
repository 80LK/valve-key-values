# valve-key-values

A simple parser of the [KeyValues](https://developer.valvesoftware.com/wiki/KeyValues) format from **Valve**

## Usage

**[WARNING]:** My experience with Steam files shows that keys are case-independent, and for convenience of working with an object, keys are automatically converted to lowercase. If my experience is wrong, you can create an issue.

### Parsing
```ts
import VKV from "valve-key-values"

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
	key1: string;
	key2: {
		key3: string;
		key4: string;
		key5: {
			key6: string;
		}
	}
}

const parsed_object = VKV.parse<ExampleObject>(raw);
console.log("OUTPUT:\n", parsed_object);
```

OUTPUT:
```json
{
	"key1": "Value1",
	"key2": {
		"key3": "Value2",
		"key4": "Value3",
		"key5": {
			"key6": "Value7"
		}
	}
}
```

### Stringify

```ts
import VKV from "valve-key-values"
//The raw and ExampleObject values are in the Parsing section 
const parsed_object = VKV.parse<ExampleObject>(raw);
parsed_object.key2.key4 = "Test write"
console.log("OUTPUT:\n", VKV.strigify(parsed_object));
```

OUTPUT:
```vdf
"key1"	"Value1"
"key2"
{
	"key3"	"Value2"
	"key4"	"Test write"
	"key5"
	{
		"key6"	"Value7"
	}
}
```
