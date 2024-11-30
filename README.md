# valve-key-values

A simple parser of the [KeyValues](https://developer.valvesoftware.com/wiki/KeyValues) format from **Valve**

## Usage

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
```

OUTPUT:
```json
{
	"Key1": "Value1",
	"Key2": {
		"Key3": "Value2",
		"Key4": "Value3",
		"Key5": {
			"Key6": "Value7"
		}
	}
}
```

### Stringify

```ts
import VKV from "valve-key-values"
//The raw and ExampleObject values are in the Parsing section 
const parsed_object = VKV.parse<ExampleObject>(raw);
parsed_object.Key2.Key4 = "Test write"
console.log("OUTPUT:\n", VKV.strigify(parsed_object));
```

OUTPUT:
```vdf
"Key1"	"Value1"
"Key2"
{
	"Key3"	"Value2"
	"Key4"	"Test write"
	"Key5"
	{
		"Key6"	"Value7"
	}
}
```
