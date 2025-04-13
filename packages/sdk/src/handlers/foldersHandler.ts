import { FileListingResponse } from "../types";
import { doFetch } from "../utils/api";
import { tryCatch } from "../utils/tryCatch";
import filesHandler from "./filesHandler";

const foldersHandler = (
  collectionId: string,
  folderId: string,
  apiKey: string
) => {
  return {
    delete: async () => {
      return await tryCatch(
        doFetch<void>(
          `collections/${collectionId}/folders/${folderId}`,
          apiKey,
          { method: "DELETE" }
        )
      );
    },

    listFiles: async () => {
      return await tryCatch(
        doFetch<FileListingResponse>(
          `collections/${collectionId}/files?folderId=${folderId}`,
          apiKey,
          { method: "GET" }
        )
      );
    },

    file: (fileId: string) => {
      return filesHandler(collectionId, fileId, apiKey);
    },
  };
};

export default foldersHandler;
