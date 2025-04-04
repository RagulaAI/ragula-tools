![Ragula Logo](https://6oday7lp8g.ufs.sh/f/I72vs5jlAS6TvD3nqAH4s7xKEMj19GiNQy0XmRfcvD6T4aVJ)

# Ragula Tool Monorepo

This repository contains the various packages for the Ragula Tool project.

## Node.js Packages

*   **`packages/ai-tool`**: Provides a tool for integrating Ragula's knowledge base retrieval capabilities with AI models through the Vercel AI SDK.
*   **`packages/langchain-tool`**: Integrates Langchain capabilities for building language model applications in Node.js.
*   **`packages/sdk`**: The core Software Development Kit for interacting with Ragula services in Node.js, providing methods for managing collections, folders, files, and performing queries.

## Python Packages

*   **`packages/ai_tool_py`**: Provides a tool for integrating Ragula's knowledge base retrieval capabilities with AI models in Python, compatible with frameworks like LangChain and LlamaIndex.
*   **`packages/langchain_tool_py`**: Integrates Langchain capabilities for building language model applications in Python.
*   **`packages/sdk_py`**: The core Software Development Kit for interacting with Ragula services in Python, providing methods for managing collections, folders, files, and performing queries.

## Package Installation

To install the published packages, use the appropriate package manager from your project's root directory or any location where you intend to use them.

**Prerequisites:**
*   Ensure you have Node.js and npm installed for Node.js packages.
*   Ensure you have Python and pip installed for Python packages.

### Node.js Packages (@ragula/)

Install the necessary Node.js packages using npm:

*   **`@ragula/ai-tool`**:
    ```bash
    npm install @ragula/ai-tool
    ```
*   **`@ragula/langchain-tool`**:
    ```bash
    npm install @ragula/langchain-tool
    ```
*   **`@ragula/sdk`**:
    ```bash
    npm install @ragula/sdk
    ```

### Python Packages (ragula-)

Install the necessary Python packages using pip:

*   **`ragula-ai-tool`**:
    ```bash
    pip install ragula-ai-tool
    ```
*   **`ragula-langchain-tool`**:
    ```bash
    pip install ragula-langchain-tool
    ```
*   **`ragula-sdk`**:
    ```bash
    pip install ragula-sdk
    ```

## Usage Examples

### Node.js SDK

```typescript
import Ragula from '@ragula/sdk';

// Initialize the client
const ragula = new Ragula('YOUR_API_KEY');

// List collections
const { data: collections } = await ragula.listCollections();
console.log('Collections:', collections);

// Create a collection
const { data: newCollection } = await ragula.createCollection('My Collection', 'Description');

// Query a collection
const collectionHandler = ragula.collection(newCollection.id);
const { data: queryResults } = await collectionHandler.query('search term');
```

### Node.js AI Tool

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

### Python SDK

```python
from ragula.sdk import RagulaClient

# Initialize the client
client = RagulaClient(token="YOUR_API_KEY")

# List collections
collections = client.collections.list_collections()
print("Collections:", collections)

# Create a collection
new_collection = client.collections.create_collection(
    name="My Collection",
    description="Description"
)

# Query a collection
query_results = client.query.query_collection(
    collection_id=new_collection["id"],
    query="search term"
)
```

### Python AI Tool

```python
from ragula.ai_tool import ragula_tool
from langchain.agents import Tool
from langchain.chat_models import ChatOpenAI
from langchain.agents import initialize_agent
from langchain.agents import AgentType

# Create the Ragula tool
ragula_kb_tool = ragula_tool(
    api_key="YOUR_RAGULA_API_KEY",
    collection_id="YOUR_COLLECTION_ID"
)

# Convert to LangChain Tool
tools = [
    Tool(
        name="knowledgebase",
        func=ragula_kb_tool["execute"],
        description=ragula_kb_tool["description"]
    )
]

# Initialize the LLM
llm = ChatOpenAI(temperature=0)

# Create an agent with the tools
agent = initialize_agent(
    tools,
    llm,
    agent=AgentType.CHAT_CONVERSATIONAL_REACT_DESCRIPTION,
    verbose=True
)

# Use the agent
agent.run(
    "Tell me about the Great Pyramid of Giza using the knowledgebase."
)