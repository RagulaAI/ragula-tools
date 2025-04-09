from datetime import datetime
from typing import List, Optional, Any
from pydantic import BaseModel, Field

# Base Models from Node.js types.ts

class Collection(BaseModel):
    id: str
    name: str
    description: Optional[str] = None
    user_id: str = Field(alias="userId")
    created_at: datetime = Field(alias="createdAt")
    updated_at: datetime = Field(alias="updatedAt")
    datastore_id: Optional[str] = Field(default=None, alias="datastoreId")

class CollectionStatus(BaseModel):
    status: str
    file_count: int = Field(alias="fileCount")
    total_size: int = Field(alias="totalSize") # Assuming size is in bytes, hence int

class Folder(BaseModel):
    id: str
    name: str
    parent_id: Optional[str] = Field(default=None, alias="parentId")
    collection_id: str = Field(alias="collectionId")
    created_at: datetime = Field(alias="createdAt")
    updated_at: datetime = Field(alias="updatedAt")

class File(BaseModel):
    id: str
    name: str
    type: str
    size: int # Assuming size is in bytes
    collection_id: str = Field(alias="collectionId")
    folder_id: Optional[str] = Field(default=None, alias="folderId")
    created_at: datetime = Field(alias="createdAt")
    updated_at: datetime = Field(alias="updatedAt")
    storage_path: str = Field(alias="storagePath")

class QueryFilter(BaseModel):
    folder_ids: Optional[List[str]] = Field(default=None, alias="folderIds")
    file_types: Optional[List[str]] = Field(default=None, alias="fileTypes")

class QueryResultItem(BaseModel):
    file_id: str = Field(alias="fileId")
    score: float
    content_snippet: Optional[str] = Field(default=None, alias="contentSnippet")

class QueryResponse(BaseModel):
    results: List[QueryResultItem]

# Payload Models for Requests

class CreateCollectionPayload(BaseModel):
    name: str
    description: Optional[str] = None

class UpdateCollectionPayload(BaseModel):
    # Using Optional for partial updates as indicated by '?' in Node.js type
    name: Optional[str] = None
    description: Optional[str] = None

class CreateFolderPayload(BaseModel):
    name: str
    parent_id: Optional[str] = Field(default=None, alias="parentId")

# Note: UploadFilePayload is handled via multipart/form-data,
# so a Pydantic model might not directly map to the request structure.
# The parameters will likely be handled directly in the function signature.

# Simplified Query Payload for SDK methods as noted in definitions
class SimpleQueryPayload(BaseModel):
    query: str

# Full Query Payload (defined for completeness, might be used internally)
class QueryPayload(BaseModel):
    query: str
    top_k: Optional[int] = Field(default=None, alias="topK")
    filter: Optional[QueryFilter] = None

# Response Type Aliases (for clarity in function signatures)
ListCollectionsResponse = List[Collection]
CreateCollectionResponse = Collection
GetCollectionResponse = Collection
UpdateCollectionResponse = Collection
GetCollectionStatusResponse = CollectionStatus
QueryCollectionResponse = QueryResponse
ListFoldersResponse = List[Folder]
CreateFolderResponse = Folder
ListFilesResponse = List[File]
UploadFileResponse = File