import {
  Collection,
  CollectionStatus,
  CreateFolderPayload,
  Folder,
  QueryResponse,
  UpdateCollectionPayload,
} from "../types";
import { doFetch } from "../utils/api";
import { tryCatch } from "../utils/tryCatch";
import foldersHandler from "./foldersHandler";

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
        doFetch<QueryResponse>(`collections/${collectionId}/question`, apiKey, {
          method: "POST",
          body: JSON.stringify({ question }),
        })
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

    listFolders: async () => {
      return await tryCatch(
        doFetch<Folder[]>(`collections/${collectionId}/folders`, apiKey)
      );
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

    listFiles: async () => {
      return await tryCatch(
        doFetch<Folder[]>(`collections/${collectionId}/files`, apiKey)
      );
    },

    uploadFile: async (file: File) => {
      const formData = new FormData();
      formData.append("file", file);

      return await tryCatch(
        doFetch<Folder>(`collections/${collectionId}/files`, apiKey, {
          method: "POST",
          body: formData,
        })
      );
    },

    file: (fileId: string) => foldersHandler(collectionId, fileId, apiKey),
  };
};

export default collectionHandler;
