import {
  AskQuestionResponse,
  Collection,
  CollectionStatus,
  CreateFolderPayload,
  CreateLinkResponse,
  File,
  FileListingResponse,
  Folder,
  Link,
  LinkCreateRequest,
  QueryResponse,
  UpdateCollectionPayload,
} from "../types";
import { doFetch } from "../utils/api";
import { tryCatch } from "../utils/tryCatch";
import foldersHandler from "./foldersHandler";
import linksHandler from "./linksHandler";

const collectionHandler = (collectionId: string, apiKey: string) => {
  return {
    query: async (query: string) => {
      return await tryCatch(
        doFetch<QueryResponse>(`collections/${collectionId}/query`, apiKey, {
          method: "POST",
          body: JSON.stringify({ query }),
        })
      );
    },

    question: async (question: string) => {
      return await tryCatch(
        doFetch<AskQuestionResponse>(
          `collections/${collectionId}/question`,
          apiKey,
          {
            method: "POST",
            body: JSON.stringify({ question }),
          }
        )
      );
    },

    details: async () => {
      return await tryCatch(
        doFetch<Collection>(`collections/${collectionId}`, apiKey)
      );
    },

    status: async () => {
      return await tryCatch(
        doFetch<CollectionStatus>(`collections/${collectionId}/status`, apiKey)
      );
    },

    update: async (payload: UpdateCollectionPayload) => {
      return await tryCatch(
        doFetch<Collection>(`collections/${collectionId}`, apiKey, {
          method: "PUT",
          body: JSON.stringify(payload),
        })
      );
    },

    delete: async () => {
      return await tryCatch(
        doFetch<void>(`collections/${collectionId}`, apiKey, {
          method: "DELETE",
        })
      );
    },

    listFolders: async (parentId?: string) => {
      const url = parentId
        ? `collections/${collectionId}/folders?parentId=${parentId}`
        : `collections/${collectionId}/folders`;

      return await tryCatch(doFetch<Folder[]>(url, apiKey));
    },

    createFolder: async (payload: CreateFolderPayload) => {
      return await tryCatch(
        doFetch<Folder>(`collections/${collectionId}/folders`, apiKey, {
          method: "POST",
          body: JSON.stringify(payload),
        })
      );
    },

    folder: (folderId: string) => {
      return foldersHandler(collectionId, folderId, apiKey);
    },

    listFiles: async (folderId?: string) => {
      const url = folderId
        ? `collections/${collectionId}/files?folderId=${folderId}`
        : `collections/${collectionId}/files`;

      return await tryCatch(doFetch<FileListingResponse>(url, apiKey));
    },

    uploadFile: async (file: Blob, folderId?: string) => {
      const formData = new FormData();
      formData.append("file", file);

      if (folderId) {
        formData.append("folderId", folderId);
      }

      return await tryCatch(
        doFetch<File>(`collections/${collectionId}/files`, apiKey, {
          method: "POST",
          body: formData,
        })
      );
    },

    file: (fileId: string) => foldersHandler(collectionId, fileId, apiKey),

    createLink: async (payload: LinkCreateRequest) => {
      return await tryCatch(
        doFetch<CreateLinkResponse>(
          `collections/${collectionId}/links`,
          apiKey,
          {
            method: "POST",
            body: JSON.stringify(payload),
          }
        )
      );
    },

    deleteLink: async (linkId: string) => {
      return await tryCatch(
        doFetch<void>(`collections/${collectionId}/links/${linkId}`, apiKey, {
          method: "DELETE",
        })
      );
    },

    link: (linkId: string) => linksHandler(collectionId, linkId, apiKey),
  };
};

export default collectionHandler;
