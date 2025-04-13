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

// Working with folders
// List folders (optionally filtered by parentId)
const { data: folders } = await collectionHandler.listFolders();
const { data: subFolders } = await collectionHandler.listFolders('parent-folder-id');

// Create a folder
const { data: newFolder } = await collectionHandler.createFolder({
  name: 'My Folder',
  parentId: null
});

// Working with files
// List files (optionally filtered by folderId)
const { data: fileListingResponse } = await collectionHandler.listFiles();
// fileListingResponse.items contains an array of File, Folder, and Link objects
const { data: folderFiles } = await collectionHandler.listFiles('folder-id');

// Upload a file (optionally to a specific folder)
const fileBlob = new Blob(['file content'], { type: 'text/plain' });
const { data: uploadedFile } = await collectionHandler.uploadFile(fileBlob);
const { data: uploadedFileInFolder } = await collectionHandler.uploadFile(fileBlob, 'folder-id');

// Working with links
// Create a link (optionally in a specific folder)
const { data: newLink } = await collectionHandler.createLink({
  name: 'Example Link',
  url: 'https://example.com',
  folderId: null
});

// Delete a link
await collectionHandler.deleteLink('link-id');

// Ask a question
const { data: answerResponse } = await collectionHandler.question('What is Ragula?');
// answerResponse.answer contains the answer string
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

## Ragula SDK API Reference

The Ragula SDK provides a comprehensive set of methods for interacting with Ragula services. Below is a reference of the available methods and their parameters.

### Collection Management

- **listCollections()**
  Lists all collections accessible to the user.
  Returns: `ListCollectionsResponse` (Array of `Collection` objects)

- **createCollection(name: string, description: string | null)**
  Creates a new collection.
  Returns: `CreateCollectionResponse` (A `Collection` object)

### Collection-specific Operations

When you have a collection instance (`ragula.collection(collectionId)`), you can perform the following operations:

- **query(query: string)**
  Performs a semantic search on the collection.
  Returns: `QueryResponse` containing an array of search results

- **question(question: string)**
  Asks a question to the collection and receives an AI-generated answer.
  Returns: `AskQuestionResponse` with the answer as a string

- **details()**
  Gets detailed information about the collection.
  Returns: A `Collection` object

- **status()**
  Gets the current status of the collection.
  Returns: `CollectionStatus` object with information about file count and size

- **update(payload: UpdateCollectionPayload)**
  Updates the collection's name or description.
  Returns: Updated `Collection` object

- **delete()**
  Deletes the collection.
  Returns: void

### Folder Operations

- **listFolders(parentId?: string)**
  Lists folders in the collection, optionally filtered by parent folder.
  Returns: Array of `Folder` objects

- **createFolder(payload: CreateFolderPayload)**
  Creates a new folder in the collection.
  Returns: Created `Folder` object

- **folder(folderId: string)**
  Returns a handler for folder-specific operations.
  The folder handler provides methods like `delete()` and `listFiles()`.

### File Operations

- **listFiles(folderId?: string)**
  Lists files in the collection, optionally filtered by folder.
  Returns: `FileListingResponse` containing an array of `File`, `Folder`, and `Link` objects

- **uploadFile(file: Blob, folderId?: string)**
  Uploads a file to the collection, optionally to a specific folder.
  Returns: Uploaded `File` object

- **file(fileId: string)**
  Returns a handler for file-specific operations.
  The file handler provides methods like `delete()`.

### Link Operations

- **createLink(payload: LinkCreateRequest)**
  Creates a new link in the collection.
  Payload includes: `name`, `url`, and optional `folderId`.
  Returns: Created `Link` object

- **deleteLink(linkId: string)**
  Deletes a link from the collection.
  Returns: void

- **link(linkId: string)**
  Returns a handler for link-specific operations.
  The link handler provides methods like `delete()`.

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

# Working with folders
# List folders (optionally filtered by parent_id)
folders = client.folders.list_folders(collection_id=new_collection["id"])
sub_folders = client.folders.list_folders(
    collection_id=new_collection["id"],
    parent_id="parent-folder-id"
)

# Create a folder
new_folder = client.folders.create_folder(
    collection_id=new_collection["id"],
    name="My Folder",
    parent_id=None
)

# Working with files
# List files (optionally filtered by folder_id)
file_listing = client.files.list_files(collection_id=new_collection["id"])
# file_listing["items"] contains an array of File, Folder, and Link objects
folder_files = client.files.list_files(
    collection_id=new_collection["id"],
    folder_id="folder-id"
)

# Upload a file (optionally to a specific folder)
with open("example.txt", "rb") as file:
    uploaded_file = client.files.upload_file(
        collection_id=new_collection["id"],
        file=file
    )
    
    # Upload to a specific folder
    uploaded_file_in_folder = client.files.upload_file(
        collection_id=new_collection["id"],
        file=file,
        folder_id="folder-id"
    )

# Working with links
# Create a link (optionally in a specific folder)
new_link = client.links.create_link(
    collection_id=new_collection["id"],
    name="Example Link",
    url="https://example.com",
    folder_id=None
)

# Delete a link
client.links.delete_link(
    collection_id=new_collection["id"],
    link_id="link-id"
)

# Ask a question
answer_response = client.query.ask_question(
    collection_id=new_collection["id"],
    question="What is Ragula?"
)
# answer_response["answer"] contains the answer string
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