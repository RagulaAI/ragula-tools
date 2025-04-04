![Ragula Logo](https://6oday7lp8g.ufs.sh/f/I72vs5jlAS6TvD3nqAH4s7xKEMj19GiNQy0XmRfcvD6T4aVJ)

# Ragula Node.js SDK

This package provides a Node.js SDK for interacting with the Ragula API.

## Installation

```bash
npm install @ragula/sdk
# or
yarn add @ragula/sdk
```

## Authentication & Usage

Instantiate the `Ragula` client with your API key.

```typescript
import Ragula from '@ragula/sdk'; // Assuming default export

// 1. Instantiate the client
const ragula = new Ragula('YOUR_API_KEY'); // Replace with your actual API key

// 2. Use the client methods
async function main() {
  try {
    // List collections
    const collections = await ragula.listCollections();
    console.log('Collections:', collections);

    // Create a collection
    const newCollection = await ragula.createCollection('My New Collection', 'Description');
    console.log('New Collection:', newCollection);

    // Access collection-specific operations
    const collectionId = newCollection.id; // Assuming the response has an id
    const collectionHandler = ragula.collection(collectionId);

    // Example: List files in the collection (Method names are illustrative)
    // const files = await collectionHandler.listFiles();
    // console.log('Files:', files);

    // Example: Query the collection (Method names are illustrative)
    // const queryResults = await collectionHandler.query({ query: 'Search term' });
    // console.log('Query Results:', queryResults);

  } catch (error) {
    console.error('API Call Failed:', error);
  }
}

main();
```

## SDK Structure

The SDK provides a main `Ragula` class for top-level operations like managing collections.

- `new Ragula(apiKey)`: Creates a new client instance.
- `ragula.listCollections()`: Lists all accessible collections.
- `ragula.createCollection(name, description)`: Creates a new collection.
- `ragula.collection(collectionId)`: Returns a handler object for operations specific to a single collection (e.g., managing files, folders, querying).

### Collection Handler

The object returned by `ragula.collection(collectionId)` provides methods to interact with a specific collection:

#### Collection Methods
- `details()`: Get detailed information about the collection
- `status()`: Get the current status of the collection (file count, size, etc.)
- `update(payload)`: Update collection properties (name, description)
- `delete()`: Delete the collection
- `query(query)`: Perform a search query against the collection

#### Folder Operations
- `listFolders()`: List all folders in the collection
- `createFolder(payload)`: Create a new folder in the collection
- `folder(folderId)`: Get a handler for operations on a specific folder

#### File Operations
- `listFiles()`: List all files in the collection
- `uploadFile(file)`: Upload a file to the collection
- `file(fileId)`: Get a handler for operations on a specific file

## Error Handling

Methods generally return Promises. If an API call fails or encounters an error, the Promise will reject. Use standard `try...catch` blocks or `.catch()` on the Promise chain to handle errors.

```typescript
import Ragula from '@ragula/sdk';

const ragula = new Ragula('YOUR_API_KEY');

async function getCollections() {
  try {
    const collections = await ragula.listCollections();
    console.log('Collections:', collections);
  } catch (error) {
    console.error('Error fetching collections:', error);
    // Handle the error appropriately
  }
}

getCollections();
```

### Folder Handler

The object returned by `ragula.collection(collectionId).folder(folderId)` provides methods to interact with a specific folder:

- `delete()`: Delete the folder
- `listFiles()`: List all files in the folder
- `file(fileId)`: Get a handler for operations on a specific file

### File Handler

The object returned by `ragula.collection(collectionId).file(fileId)` or `ragula.collection(collectionId).folder(folderId).file(fileId)` provides methods to interact with a specific file:

- `delete()`: Delete the file

## Type Definitions

Refer to the source code or specific type definitions (`src/types.ts`) for details on request/response structures and available methods.

## Development

### Running Tests

```bash
npm test
```

The test suite uses Jest and includes tests for:

- Core SDK functionality (`src/__tests__/index.test.ts`)
- Collection handler methods (`src/__tests__/collectionHandler.test.ts`)
- Folder handler methods (`src/__tests__/foldersHandler.test.ts`)
- File handler methods (`src/__tests__/filesHandler.test.ts`)