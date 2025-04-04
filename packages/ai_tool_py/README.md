# Ragula AI Tool for Python

This package provides a tool for integrating Ragula's knowledge base retrieval capabilities with AI models in Python.

## Installation

```bash
pip install ragula-ai-tool
```

## Prerequisites

- A Ragula API key
- A Ragula collection ID
- Python 3.8 or higher

## Usage

The `ragula_tool` function creates a tool that can be used with various AI frameworks to fetch relevant context from a Ragula knowledge base.

### Basic Usage

```python
from ragula.ai_tool import ragula_tool

# Create the tool
kb_tool = ragula_tool(
    api_key="YOUR_RAGULA_API_KEY",
    collection_id="YOUR_COLLECTION_ID"
)
```

### Using with LangChain

```python
from langchain.agents import Tool
from langchain.chat_models import ChatOpenAI
from langchain.agents import initialize_agent
from langchain.agents import AgentType
from ragula.ai_tool import ragula_tool

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
```

### Using with LlamaIndex

```python
from llama_index.core import Settings
from llama_index.llms.openai import OpenAI
from llama_index.core.tools import FunctionTool
from llama_index.core.agent import ReActAgent
from ragula.ai_tool import ragula_tool

# Create the Ragula tool
ragula_kb_tool = ragula_tool(
    api_key="YOUR_RAGULA_API_KEY",
    collection_id="YOUR_COLLECTION_ID"
)

# Convert to LlamaIndex Tool
kb_tool = FunctionTool.from_defaults(
    name="knowledgebase",
    fn=ragula_kb_tool["execute"],
    description=ragula_kb_tool["description"]
)

# Initialize the LLM
Settings.llm = OpenAI(model="gpt-3.5-turbo")

# Create an agent with the tools
agent = ReActAgent.from_tools(
    [kb_tool],
    verbose=True
)

# Use the agent
response = agent.query(
    "Tell me about the Great Pyramid of Giza using the knowledgebase."
)
print(response)
```

## How It Works

The `ragula_tool` function:

1. Creates a tool with a description and parameters
2. When executed, it:
   - Connects to the Ragula API using the provided API key
   - Queries the specified collection with the user's query
   - Processes the results and returns the relevant context
   - Handles errors appropriately

## API Reference

### ragula_tool(api_key, collection_id)

Creates a tool that can be used with AI frameworks.

**Parameters:**

- `api_key` (str): Your Ragula API key
- `collection_id` (str): The ID of the Ragula collection to query

**Returns:**

A dictionary containing:
- `name`: The name of the tool
- `description`: A description of what the tool does
- `parameters`: The parameters the tool accepts
- `execute`: The function that executes the tool

## Related Packages

- [ragula-sdk](../sdk_py): The Python SDK for interacting with the Ragula API

## License

MIT