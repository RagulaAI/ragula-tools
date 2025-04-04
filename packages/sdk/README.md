# Ragula Node.js SDK

This package provides a Node.js SDK for interacting with the Ragula API. It is generated based on the API's OpenAPI specification.

## Installation

Currently, this SDK is intended for local usage within the monorepo. You can install it from the root of the project:

```bash
npm install ./packages/sdk
```

Alternatively, if you intend to publish it to a registry like npm in the future, the installation would typically be:

```bash
npm install @ragula/sdk
```

This SDK uses `axios` for making HTTP requests, which is included as a direct dependency.

## Basic Usage

First, configure the base URL for the Ragula API. Then, you can import and use the available services.

```typescript
import { OpenAPI, CollectionsService } from '@ragula/sdk';

// Configure the base URL of your Ragula API instance
OpenAPI.BASE = 'http://localhost:8000'; // Replace with your actual API URL

async function listMyCollections() {
  const { result, error } = await tryCatch(CollectionsService.getApiCollections());
  
  if (error) {
    console.error('Error fetching collections:', error);
    return;
  }
  
  console.log('Available Collections:', result);
}

listMyCollections();
```

## Error Handling

The SDK provides an `ApiError` class for handling API-specific errors. You can use the `tryCatch` helper function to simplify error handling:

```typescript
// Helper function for cleaner error handling
async function tryCatch<T>(promise: Promise<T>): Promise<{ result?: T; error?: any }> {
  try {
    const result = await promise;
    return { result };
  } catch (error) {
    return { error };
  }
}

// Example usage
async function createCollection() {
  const { result, error } = await tryCatch(
    CollectionsService.postApiCollections({
      name: 'My Collection',
      description: 'A collection of documents'
    })
  );
  
  if (error) {
    console.error('Failed to create collection:', error);
    return;
  }
  
  console.log('Collection created:', result);
}
```

## Available Services

The SDK provides the following services, corresponding to different parts of the Ragula API:

* `CollectionsService`: Manage collections.
* `FilesService`: Manage files within collections.
* `FoldersService`: Manage folders within collections.
* `QueryService`: Perform queries against collections.

## Service Examples

### Collections Service

```typescript
// List all collections
const collections = await CollectionsService.getApiCollections();

// Create a new collection
const newCollection = await CollectionsService.postApiCollections({
  name: 'Research Papers',
  description: 'Academic research papers on AI'
});

// Get a specific collection
const collection = await CollectionsService.getApiCollections1('collection-id');

// Update a collection
const updatedCollection = await CollectionsService.putApiCollections(
  'collection-id',
  { name: 'Updated Name' }
);

// Delete a collection
await CollectionsService.deleteApiCollections('collection-id');

// Get collection processing status
const status = await CollectionsService.getApiCollectionsStatus('collection-id');
```

### Files Service

```typescript
// List files in a collection
const files = await FilesService.getApiCollectionsFiles('collection-id');

// Upload a file (example with FormData)
const formData = new FormData();
formData.append('file', fileBlob);
formData.append('path', '/documents/research.pdf');

const uploadedFile = await FilesService.postApiCollectionsFiles(
  'collection-id',
  formData
);
```

Refer to the specific service methods for details on available operations and their parameters.