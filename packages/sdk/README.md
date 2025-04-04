![Ragula Logo](https://6oday7lp8g.ufs.sh/f/I72vs5jlAS6TvD3nqAH4s7xKEMj19GiNQy0XmRfcvD6T4aVJ)

# Ragula Node.js SDK

This package provides a Node.js SDK for interacting with the Ragula API. It is generated based on the API's OpenAPI specification.

## Installation

```bash
npm install @ragula/sdk
```

This SDK uses `axios` for making HTTP requests, which is included as a direct dependency.

## Basic Usage

Import and use the available services:

```typescript
import { CollectionsService } from '@ragula/sdk';

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