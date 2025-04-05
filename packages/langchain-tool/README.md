# @ragula/langchain-tool

This package provides a helper function to simplify the creation of Langchain tools using `@langchain/core/tools` and `zod` for schema validation.

## Installation

```bash
npm install @ragula/langchain-tool @langchain/core zod
# or
yarn add @ragula/langchain-tool @langchain/core zod
```

## Usage

Import the `createLangchainTool` helper and define your tool:

```typescript
import { z } from "zod";
import { createLangchainTool } from "@ragula/langchain-tool";

// 1. Define the input schema using Zod
const adderSchema = z.object({
  a: z.number().describe("The first number to add"),
  b: z.number().describe("The second number to add"),
});

// 2. Create the tool using the helper
const adderTool = createLangchainTool({
  name: "adder",
  description: "Adds two numbers together",
  schema: adderSchema,
  func: async (input) => {
    // Input is automatically validated and typed based on adderSchema
    const sum = input.a + input.b;
    return `The sum of ${input.a} and ${input.b} is ${sum}`;
  },
});

// 3. Use the tool (example with Langchain - requires additional setup)
async function runExample() {
  try {
    const result = await adderTool.invoke({ a: 5, b: 3 });
    console.log(result); // Output: The sum of 5 and 3 is 8
  } catch (error) {
    console.error("Error invoking tool:", error);
  }
}

runExample();
```

The `createLangchainTool` function takes care of integrating the schema and execution logic with Langchain's `tool` function.
