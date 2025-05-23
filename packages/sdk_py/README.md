![Ragula Logo](https://6oday7lp8g.ufs.sh/f/I72vs5jlAS6TvD3nqAH4s7xKEMj19GiNQy0XmRfcvD6T4aVJ)

# Ragula Python SDK

This SDK provides a Python interface for interacting with the Ragula REST API. It simplifies making requests to manage collections, folders, files, and perform queries.

## Installation

This SDK requires Python 3.8+ and the `requests` library.

```bash
pip install ragula-sdk
```

The necessary `requests` dependency will be installed automatically.

## Basic Usage

Here's a simple example of how to initialize the client and list your collections:

```python
from ragula.sdk import RagulaClient

# Initialize Client with your API token
RAGULA_API_TOKEN = "YOUR_API_TOKEN"
client = RagulaClient(token=RAGULA_API_TOKEN)

# Example: List Collections
collections = client.collections.list_collections()
print("Available Collections:")
if collections:
    for collection in collections:
        print(f"- ID: {collection.get('id')}, Name: {collection.get('name')}")
else:
    print("No collections found.")
```

## Available Services

The client provides access to different API services through attributes:

* `client.collections`: Manage collections
* `client.folders`: Manage folders within collections
* `client.files`: Manage files within folders/collections
* `client.query`: Perform queries against collections

## Service Examples

### Collections Service

```python
# List all collections
collections = client.collections.list_collections()

# Create a new collection
new_collection = client.collections.create_collection(
    name="Research Papers",
    description="Academic research papers on AI"
)

# Get a specific collection
collection = client.collections.get_collection("collection-id")

# Update a collection
updated_collection = client.collections.update_collection(
    collection_id="collection-id",
    name="Updated Name"
)

# Delete a collection
client.collections.delete_collection("collection-id")

# Get collection processing status
status = client.collections.get_collection_status("collection-id")
```

### Files Service

```python
# List files in a collection
files = client.files.list_files("collection-id")

# List files in a specific folder
folder_files = client.files.list_files("collection-id", folder_id="folder-id")

# Upload a file using a file path
uploaded_file = client.files.upload_file(
    collection_id="collection-id",
    file_path="./document.pdf",
    folder_id="folder-id"  # Optional
)

# Upload a file using file content
with open("document.pdf", "rb") as file:
    uploaded_file = client.files.upload_file(
        collection_id="collection-id",
        file_content=file,
        file_name="document.pdf",
        folder_id="folder-id"  # Optional
    )

# Delete a file
client.files.delete_file("collection-id", "file-id")
```

### Folders Service

```python
# List folders in a collection
folders = client.folders.list_folders("collection-id")

# List subfolders in a specific folder
subfolders = client.folders.list_folders("collection-id", parent_id="parent-folder-id")

# Create a new folder
new_folder = client.folders.create_folder(
    collection_id="collection-id",
    name="Research Documents",
    parent_id="parent-folder-id"  # Optional
)

# Delete a folder
client.folders.delete_folder("collection-id", "folder-id")
```

### Query Service

```python
# Basic query
results = client.query.query_collection(
    collection_id="collection-id",
    query="What is machine learning?"
)

# Advanced query with filters
results = client.query.query_collection(
    collection_id="collection-id",
    query="What is machine learning?",
    top_k=5,
    folder_ids=["folder-id-1", "folder-id-2"],
    file_types=["pdf", "txt"]
)
```

Refer to the specific service methods for details on available operations and their parameters.