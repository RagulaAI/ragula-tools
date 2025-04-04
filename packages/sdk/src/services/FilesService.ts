/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CancelablePromise } from "../core/CancelablePromise";
import { OpenAPI } from "../core/OpenAPI";
import { request as __request } from "../core/request";
export class FilesService {
  /**
   * List files in a collection (optionally filtered by folder)
   * @param collectionId The ID of the collection
   * @param folderId
   * @returns any A list of files
   * @throws ApiError
   */
  public static getApiCollectionsFiles(
    collectionId: string,
    folderId?: string
  ): CancelablePromise<
    Array<{
      id: string;
      name: string;
      type: string;
      size: number;
      collectionId: string;
      folderId: string | null;
      createdAt: string;
      updatedAt: string;
      storagePath: string;
    }>
  > {
    return __request<
      Array<{
        id: string;
        name: string;
        type: string;
        size: number;
        collectionId: string;
        folderId: string | null;
        createdAt: string;
        updatedAt: string;
        storagePath: string;
      }>
    >(OpenAPI, {
      method: "GET",
      url: "/api/collections/{collectionId}/files",
      path: {
        collectionId: collectionId,
      },
      query: {
        folderId: folderId,
      },
      errors: {
        401: `Unauthorized`,
        404: `Collection or Folder Not Found`,
      },
    });
  }
  /**
   * Upload a file to a collection (specify folderId in body)
   * @param collectionId The ID of the collection
   * @param formData
   * @returns any File uploaded successfully
   * @throws ApiError
   */
  public static postApiCollectionsFiles(
    collectionId: string,
    formData?: {
      /**
       * The file to upload
       */
      file?: Blob;
      /**
       * Optional folder ID to place the file in
       */
      folderId?: string;
    }
  ): CancelablePromise<{
    id: string;
    name: string;
    type: string;
    size: number;
    collectionId: string;
    folderId: string | null;
    createdAt: string;
    updatedAt: string;
    storagePath: string;
  }> {
    return __request<{
      id: string;
      name: string;
      type: string;
      size: number;
      collectionId: string;
      folderId: string | null;
      createdAt: string;
      updatedAt: string;
      storagePath: string;
    }>(OpenAPI, {
      method: "POST",
      url: "/api/collections/{collectionId}/files",
      path: {
        collectionId: collectionId,
      },
      formData: formData,
      mediaType: "multipart/form-data",
      errors: {
        400: `Bad Request / Missing file`,
        401: `Unauthorized`,
        404: `Collection or Folder Not Found`,
        413: `Payload Too Large`,
      },
    });
  }
  /**
   * Delete a file within a collection
   * @param collectionId The ID of the collection
   * @param fileId The ID of the file
   * @returns void
   * @throws ApiError
   */
  public static deleteApiCollectionsFiles(
    collectionId: string,
    fileId: string
  ): CancelablePromise<void> {
    return __request<void>(OpenAPI, {
      method: "DELETE",
      url: "/api/collections/{collectionId}/files/{fileId}",
      path: {
        collectionId: collectionId,
        fileId: fileId,
      },
      errors: {
        401: `Unauthorized`,
        404: `Not Found`,
      },
    });
  }
}
