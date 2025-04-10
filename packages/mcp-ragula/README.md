# Ragula MCP Server

This package provides a Model Control Protocol (MCP) implementation for interacting with the Ragula API. It allows you to manage collections, folders, files, and perform queries using simple commands.

## Setup

### Installation

This package is typically used within a larger monorepo structure. Ensure it's correctly linked or installed. The primary dependency is `@ragula/sdk`.

```bash
# If needed in a standalone project (adjust version/path as necessary)
npm install @ragula/mcp @ragula/sdk
# or
yarn add @ragula/mcp @ragula/sdk
```

Once installed, you can run it directly using npx:

```bash
npx ragula-mcp --api-key YOUR_KEY
```

### Configuration via Command-Line Arguments

Configuration for the Ragula MCP is now handled exclusively via command-line arguments when the MCP server process is launched. This is typically configured within the main application's MCP server definition (e.g., in Cline's configuration).

**Required Argument:**

*   `--api-key` or `-k` (string): Your Ragula API key. The MCP will fail to start if this is not provided.


**Example Configuration (Conceptual - within a parent MCP runner like Cline):**

```json
{
  "mcpServers": {
    "ragula": {
      "command": "npx @ragula/mcp",
      "args": ["--api-key", "your_ragula_api_key_here"]
    }
  }
}

```

Get your API key here: https://www.ragula.io/profile


## Usage

The MCP exposes methods that correspond to Ragula API operations. These methods are intended to be called by the controlling framework or application that loads this MCP module.

```typescript
// Note: The MCP is typically instantiated by a parent process (like Cline)
// which passes the command-line arguments during startup.
// Direct instantiation like below is less common now.

// If you were to run it directly (e.g., for testing): node ./dist/index.js --api-key YOUR_KEY
// or using npx: npx ragula-mcp --api-key YOUR_KEY

// Example of interacting with an already running MCP instance
// (assuming 'mcp' is a client connected to the running MCP server)

// Example: List collections
const { data: collections, error: listError } = await mcp.callTool('ragula:listCollections');
if (listError) {
  console.error("Error listing collections:", listError);
} else {
  console.log("Collections:", collections);
}

// Example: Create a collection
const { data: newCollection, error: createError } = await mcp.callTool('ragula:createCollection', { name: 'My New Collection' });
 if (createError) {
  console.error("Error creating collection:", createError);
} else {
  console.log("Created Collection:", newCollection);
}

// ... call other tools as needed
```

Each method returns an object `{ data, error }` using the `tryCatch` helper, allowing for easy error checking.

## Available Commands / Tools

The following commands (mapping to MCP methods) are available:

### Collection Management

*   **`ragula:listCollections`**
    *   Description: Lists all available collections.
    *   Parameters: None
    *   Method: `mcp.listCollections()`
*   **`ragula:createCollection`**
    *   Description: Creates a new collection.
    *   Parameters:
        *   `name` (string): The name of the new collection.
    *   Method: `mcp.createCollection({ name })`
*   **`ragula:getCollectionDetails`**
    *   Description: Gets details for a specific collection.
    *   Parameters:
        *   `collectionId` (string): The ID of the collection.
    *   Method: `mcp.getCollectionDetails({ collectionId })`
*   **`ragula:getCollectionStatus`**
    *   Description: Gets the status of a specific collection.
    *   Parameters:
        *   `collectionId` (string): The ID of the collection.
    *   Method: `mcp.getCollectionStatus({ collectionId })`
*   **`ragula:updateCollection`**
    *   Description: Updates the name of a collection.
    *   Parameters:
        *   `collectionId` (string): The ID of the collection to update.
        *   `name` (string): The new name for the collection.
    *   Method: `mcp.updateCollection({ collectionId, name })`
*   **`ragula:deleteCollection`**
    *   Description: Deletes a specific collection.
    *   Parameters:
        *   `collectionId` (string): The ID of the collection to delete.
    *   Method: `mcp.deleteCollection({ collectionId })`

### Folder Management

*   **`ragula:listFolders`**
    *   Description: Lists folders within a collection.
    *   Parameters:
        *   `collectionId` (string): The ID of the collection.
    *   Method: `mcp.listFolders({ collectionId })`
*   **`ragula:createFolder`**
    *   Description: Creates a folder within a collection.
    *   Parameters:
        *   `collectionId` (string): The ID of the collection.
        *   `name` (string): The name of the new folder.
        *   `parentId` (string): The ID of the parent folder.
    *   Method: `mcp.createFolder({ collectionId, name, parentId })`
*   **`ragula:deleteFolder`**
    *   Description: Deletes a folder within a collection.
    *   Parameters:
        *   `collectionId` (string): The ID of the collection.
        *   `folderId` (string): The ID of the folder to delete.
    *   Method: `mcp.deleteFolder({ collectionId, folderId })`
*   **`ragula:listFolderFiles`**
    *   Description: Lists files within a specific folder of a collection.
    *   Parameters:
        *   `collectionId` (string): The ID of the collection.
        *   `folderId` (string): The ID of the folder.
    *   Method: `mcp.listFolderFiles({ collectionId, folderId })`

### File Management

*   **`ragula:listCollectionFiles`**
    *   Description: Lists all files within a collection (including subfolders).
    *   Parameters:
        *   `collectionId` (string): The ID of the collection.
    *   Method: `mcp.listCollectionFiles({ collectionId })`
*   **`ragula:uploadFile`**
    *   Description: Uploads a local file to a collection, optionally to a specific folder.
    *   Parameters:
        *   `collectionId` (string): The ID of the collection.
        *   `filePath` (string): The path to the local file to upload.
        *   `folderId` (string, optional): The ID of the folder to upload into.
    *   Method: `mcp.uploadFile({ collectionId, filePath, folderId })`
*   **`ragula:deleteFile`**
    *   Description: Deletes a file from the root of a collection.
    *   Parameters:
        *   `collectionId` (string): The ID of the collection.
        *   `fileId` (string): The ID of the file to delete.
    *   Method: `mcp.deleteFile({ collectionId, fileId })`
*   **`ragula:deleteFolderFile`**
    *   Description: Deletes a file from a specific folder within a collection.
    *   Parameters:
        *   `collectionId` (string): The ID of the collection.
        *   `folderId` (string): The ID of the folder containing the file.
        *   `fileId` (string): The ID of the file to delete.
    *   Method: `mcp.deleteFolderFile({ collectionId, folderId, fileId })`

### Querying

*   **`ragula:query`**
    *   Description: Performs a semantic query against a collection.
    *   Parameters:
        *   `collectionId` (string): The ID of the collection to query.
        *   `queryText` (string): The text of the query.
    *   Method: `mcp.query({ collectionId, queryText })`
*   **`ragula:question`**
    *   Description: Asks a question against a collection (RAG).
    *   Parameters:
        *   `collectionId` (string): The ID of the collection.
        *   `questionText` (string): The text of the question.
    *   Method: `mcp.question({ collectionId, questionText })`

## Development

### Building the Package

```bash
npm run build
```

### Running Tests

```bash
npm test
```

## License

ISC