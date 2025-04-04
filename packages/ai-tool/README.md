# Ragula AI Tool

This package provides a tool for integrating Ragula's knowledge base retrieval capabilities with AI models through the Vercel AI SDK.

## Installation

```bash
npm install @ragula/ai-tool
# or
yarn add @ragula/ai-tool
```

## Prerequisites

- A Ragula API key
- A Ragula collection ID
- Vercel AI SDK (`ai` package)

## Usage

The `ragularTool` function creates a tool that can be used with the Vercel AI SDK to fetch relevant context from a Ragula knowledge base.

```typescript
import { ragularTool } from '@ragula/ai-tool';
import { streamText } from 'ai';
import { google } from '@ai-sdk/google';

// Use the tool with an AI model
const streamResult = await streamText({
  model: google("gemini-2.0-flash-001"),
  system: `You are a specialist in egyptian pyramids, use the knowledgebase tool to source your information.`,
  messages: [
    {
      role: "user",
      content: "Tell me about the Great Pyramid of Giza",
    },
  ],
  tools: {
    knowledgebase: ragularTool('YOUR_RAGULA_API_KEY', 'YOUR_COLLECTION_ID')
  },
  maxSteps: 5,
  temperature: 0.5,
});
```

## How It Works

The `ragularTool` function:

1. Creates a tool with a description and parameters using Zod for validation
2. When executed, it:
   - Connects to the Ragula API using the provided API key
   - Queries the specified collection with the user's query
   - Processes the results and returns the relevant context
   - Handles errors appropriately

## API Reference

### ragularTool(apiKey, collectionId)

Creates a tool that can be used with the Vercel AI SDK.

**Parameters:**

- `apiKey` (string): Your Ragula API key
- `collectionId` (string): The ID of the Ragula collection to query

## Related Packages

- [@ragula/sdk](../sdk): The Node.js SDK for interacting with the Ragula API

## License

MIT