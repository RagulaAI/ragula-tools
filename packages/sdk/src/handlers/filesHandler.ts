import { doFetch } from "../utils/api";
import { tryCatch } from "../utils/tryCatch";

const filesHandler = (collectionId: string, fileId: string, apiKey: string) => {
  return {
    delete: async () => {
      return await tryCatch(
        doFetch<void>(`collections/${collectionId}/files/${fileId}`, apiKey, {
          method: "DELETE",
        })
      );
    },
  };
};

export default filesHandler;
