/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CancelablePromise } from "../core/CancelablePromise";
import type { ApiError } from "../core/ApiError";
import type { Result } from "../utils/tryCatch";
import { OpenAPI } from "../core/OpenAPI";
import { request as __request } from "../core/request";

// Define Collection type to reduce repetition
type Collection = {
  id: string;
  name: string;
  description: string | null;
  userId: string;
  createdAt: string;
  updatedAt: string;
  datastoreId: string | null;
};
export class CollectionsService {
  /**
   * List collections
   * @returns A list of collections wrapped in a Result object
   */
  public static getApiCollections(): CancelablePromise<
    Result<Array<Collection>, ApiError>
  > {
    return __request(OpenAPI, {
      method: "GET",
      url: "/api/collections",
      errors: {
        401: `Unauthorized`,
      },
    });
  }
  /**
   * Create a new collection
   * @param requestBody
   * @returns Collection created successfully wrapped in a Result object
   */
  public static postApiCollections(requestBody?: {
    name: string;
    description: string | null;
  }): CancelablePromise<Result<Collection, ApiError>> {
    return __request(OpenAPI, {
      method: "POST",
      url: "/api/collections",
      body: requestBody,
      mediaType: "application/json",
      errors: {
        400: `Bad Request`,
        401: `Unauthorized`,
      },
    });
  }
  /**
   * Get collection details by ID
   * @param collectionId The ID of the collection
   * @returns Collection details wrapped in a Result object
   */
  public static getApiCollectionById(
    collectionId: string
  ): CancelablePromise<Result<Collection, ApiError>> {
    return __request(OpenAPI, {
      method: "GET",
      url: "/api/collections/{collectionId}",
      path: {
        collectionId,
      },
      errors: {
        401: `Unauthorized`,
        404: `Not Found`,
      },
    });
  }

  /**
   * @deprecated Use getApiCollectionById instead
   */
  public static getApiCollections1(
    collectionId: string
  ): CancelablePromise<Result<Collection, ApiError>> {
    return this.getApiCollectionById(collectionId);
  }
  /**
   * Update a collection
   * @param collectionId The ID of the collection
   * @param requestBody
   * @returns Collection updated successfully wrapped in a Result object
   */
  public static putApiCollections(
    collectionId: string,
    requestBody?: {
      name?: string;
      description?: string | null;
    }
  ): CancelablePromise<Result<Collection, ApiError>> {
    return __request(OpenAPI, {
      method: "PUT",
      url: "/api/collections/{collectionId}",
      path: {
        collectionId,
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
  /**
   * Delete a collection
   * @param collectionId The ID of the collection
   * @returns void wrapped in a Result object
   */
  public static deleteApiCollections(
    collectionId: string
  ): CancelablePromise<Result<void, ApiError>> {
    return __request(OpenAPI, {
      method: "DELETE",
      url: "/api/collections/{collectionId}",
      path: {
        collectionId,
      },
      errors: {
        401: `Unauthorized`,
        404: `Not Found`,
      },
    });
  }
  /**
   * Get collection processing status
   * @param collectionId The ID of the collection
   * @returns Collection status wrapped in a Result object
   */
  public static getApiCollectionsStatus(
    collectionId: string
  ): CancelablePromise<
    Result<
      {
        status: string;
        fileCount: number;
        totalSize: number;
      },
      ApiError
    >
  > {
    return __request(OpenAPI, {
      method: "GET",
      url: "/api/collections/{collectionId}/status",
      path: {
        collectionId,
      },
      errors: {
        401: `Unauthorized`,
        404: `Not Found`,
      },
    });
  }
}
