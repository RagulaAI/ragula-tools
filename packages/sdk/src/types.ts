export interface Collection {
  id: string;
  name: string;
  description: string | null;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
  datastoreId: string | null;
}

export interface CreateCollectionPayload {
  name: string;
  description: string | null;
}

export interface UpdateCollectionPayload {
  name?: string;
  description?: string | null;
}

export interface CollectionStatus {
  status: string;
  fileCount: number;
  totalSize: number;
}

export interface Folder {
  id: string;
  name: string;
  parentId: string | null;
  collectionId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateFolderPayload {
  name: string;
  parentId: string | null;
}

export interface File {
  id: string;
  name: string;
  type: string;
  size: number;
  collectionId: string;
  folderId: string | null;
  createdAt: Date;
  updatedAt: Date;
  storagePath: string;
  isLink?: boolean;
  url?: string;
}

export interface Link {
  id: string;
  name: string;
  url: string;
  collectionId: string;
  folderId: string | null;
  createdAt: Date;
  updatedAt: Date;
  isLink: true;
}

export interface LinkCreateRequest {
  name: string;
  url: string;
  folderId?: string | null;
}

export interface UploadFilePayload {
  file: any;
  folderId?: string;
}

export interface QueryFilter {
  folderIds?: string[];
  fileTypes?: string[];
}

export interface QueryPayload {
  query: string;
  topK?: number;
  filter?: QueryFilter;
}

export interface QueryResultItem {
  fileId: string;
  score: number;
  contentSnippet?: string;
}

export interface QueryResponse {
  results: QueryResultItem[];
}

export interface AskQuestionResponse {
  answer: string;
}

export interface ErrorResponse {
  message: string;
}

export type ListCollectionsResponse = Collection[];
export type CreateCollectionResponse = Collection;
export type GetCollectionResponse = Collection;
export type UpdateCollectionResponse = Collection;
export type GetCollectionStatusResponse = CollectionStatus;
export type ListFoldersResponse = Folder[];
export type CreateFolderResponse = Folder;
export interface FileListingResponse {
  items: Array<File | Folder | Link>;
}

export type ListFilesResponse = FileListingResponse;
export type UploadFileResponse = File;
export type QueryCollectionResponse = QueryResponse;
export type CreateLinkResponse = Link;

export interface GetCollectionParams {
  collectionId: string;
}

export interface UpdateCollectionParams {
  collectionId: string;
}

export interface DeleteCollectionParams {
  collectionId: string;
}

export interface GetCollectionStatusParams {
  collectionId: string;
}

export interface ListFoldersParams {
  collectionId: string;
  parentId?: string;
}

export interface CreateFolderParams {
  collectionId: string;
}

export interface DeleteFolderParams {
  collectionId: string;
  folderId: string;
}

export interface ListFilesParams {
  collectionId: string;
  folderId?: string;
}

export interface UploadFileParams {
  collectionId: string;
}

export interface DeleteFileParams {
  collectionId: string;
  fileId: string;
}

export interface QueryCollectionParams {
  collectionId: string;
}
