/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CancelablePromise } from "../core/CancelablePromise";
import { OpenAPI } from "../core/OpenAPI";
import { request as __request } from "../core/request";
export class QueryService {
  /**
   * Query a collection
   * @param collectionId The ID of the collection
   * @param requestBody
   * @returns any Query results
   * @throws ApiError
   */
  public static postApiCollectionsQuery(
    collectionId: string,
    requestBody?: {
      query: string;
      /**
       * Number of results to return
       */
      topK?: number;
      /**
       * Optional filters for the query
       */
      filter?: {
        folderIds?: Array<string>;
        fileTypes?: Array<string>;
      };
    }
  ): CancelablePromise<{
    results: Array<{
      fileId: string;
      score: number;
      contentSnippet?: string;
    }>;
  }> {
    return __request<{
      results: Array<{
        fileId: string;
        score: number;
        contentSnippet?: string;
      }>;
    }>(OpenAPI, {
      method: "POST",
      url: "/api/collections/{collectionId}/query",
      path: {
        collectionId: collectionId,
      },
      body: requestBody,
      mediaType: "application/json",
      errors: {
        400: `Bad Request`,
        401: `Unauthorized`,
        404: `Not Found`,
      },
    });
  }
}
