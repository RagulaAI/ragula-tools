import { doFetch } from "../utils/api";
import { tryCatch } from "../utils/tryCatch";

const linksHandler = (collectionId: string, linkId: string, apiKey: string) => {
  return {
    delete: async () => {
      return await tryCatch(
        doFetch<void>(`collections/${collectionId}/links/${linkId}`, apiKey, {
          method: "DELETE",
        })
      );
    },
  };
};

export default linksHandler;
