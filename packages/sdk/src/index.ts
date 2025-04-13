import { doFetch } from "./utils/api";
import { tryCatch } from "./utils/tryCatch";
import * as ApiTypes from "./types";
export * from "./types";
import collectionHandler from "./handlers/collectionHandler";

class Ragula {
  apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async listCollections() {
    return await tryCatch(
      doFetch<ApiTypes.ListCollectionsResponse>("collections", this.apiKey)
    );
  }

  async createCollection(name: string, description: string | null) {
    const payload: ApiTypes.CreateCollectionPayload = { name, description };
    return await tryCatch(
      doFetch<ApiTypes.CreateCollectionResponse>("collections", this.apiKey, {
        method: "POST",
        body: JSON.stringify(payload),
      })
    );
  }

  collection = (collectionId: string) =>
    collectionHandler(collectionId, this.apiKey);
}

export { Ragula };
