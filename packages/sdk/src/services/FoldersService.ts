/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class FoldersService {
    /**
     * List folders in a collection
     * @param collectionId The ID of the collection
     * @param parentId
     * @returns any A list of folders
     * @throws ApiError
     */
    public static getApiCollectionsFolders(
        collectionId: string,
        parentId?: string,
    ): CancelablePromise<Array<{
        id: string;
        name: string;
        parentId: string | null;
        collectionId: string;
        createdAt: string;
        updatedAt: string;
    }>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/collections/{collectionId}/folders',
            path: {
                'collectionId': collectionId,
            },
            query: {
                'parentId': parentId,
            },
            errors: {
                401: `Unauthorized`,
                404: `Collection Not Found`,
            },
        });
    }
    /**
     * Create a folder in a collection
     * @param collectionId The ID of the collection
     * @param requestBody
     * @returns any Folder created successfully
     * @throws ApiError
     */
    public static postApiCollectionsFolders(
        collectionId: string,
        requestBody?: {
            name: string;
            parentId: string | null;
        },
    ): CancelablePromise<{
        id: string;
        name: string;
        parentId: string | null;
        collectionId: string;
        createdAt: string;
        updatedAt: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/collections/{collectionId}/folders',
            path: {
                'collectionId': collectionId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Bad Request`,
                401: `Unauthorized`,
                404: `Collection or Parent Folder Not Found`,
            },
        });
    }
    /**
     * Delete a folder within a collection
     * @param collectionId The ID of the collection
     * @param folderId The ID of the folder
     * @returns void
     * @throws ApiError
     */
    public static deleteApiCollectionsFolders(
        collectionId: string,
        folderId: string,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/collections/{collectionId}/folders/{folderId}',
            path: {
                'collectionId': collectionId,
                'folderId': folderId,
            },
            errors: {
                401: `Unauthorized`,
                404: `Not Found`,
            },
        });
    }
}
