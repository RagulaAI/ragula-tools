/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class CollectionsService {
    /**
     * List collections
     * @returns any A list of collections
     * @throws ApiError
     */
    public static getApiCollections(): CancelablePromise<Array<{
        id: string;
        name: string;
        description: string | null;
        userId: string;
        createdAt: string;
        updatedAt: string;
        datastoreId: string | null;
    }>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/collections',
            errors: {
                401: `Unauthorized`,
            },
        });
    }
    /**
     * Create a new collection
     * @param requestBody
     * @returns any Collection created successfully
     * @throws ApiError
     */
    public static postApiCollections(
        requestBody?: {
            name: string;
            description: string | null;
        },
    ): CancelablePromise<{
        id: string;
        name: string;
        description: string | null;
        userId: string;
        createdAt: string;
        updatedAt: string;
        datastoreId: string | null;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/collections',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Bad Request`,
                401: `Unauthorized`,
            },
        });
    }
    /**
     * Get collection details
     * @param collectionId The ID of the collection
     * @returns any Collection details
     * @throws ApiError
     */
    public static getApiCollections1(
        collectionId: string,
    ): CancelablePromise<{
        id: string;
        name: string;
        description: string | null;
        userId: string;
        createdAt: string;
        updatedAt: string;
        datastoreId: string | null;
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/collections/{collectionId}',
            path: {
                'collectionId': collectionId,
            },
            errors: {
                401: `Unauthorized`,
                404: `Not Found`,
            },
        });
    }
    /**
     * Update a collection
     * @param collectionId The ID of the collection
     * @param requestBody
     * @returns any Collection updated successfully
     * @throws ApiError
     */
    public static putApiCollections(
        collectionId: string,
        requestBody?: {
            name?: string;
            description?: string | null;
        },
    ): CancelablePromise<{
        id: string;
        name: string;
        description: string | null;
        userId: string;
        createdAt: string;
        updatedAt: string;
        datastoreId: string | null;
    }> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/collections/{collectionId}',
            path: {
                'collectionId': collectionId,
            },
            body: requestBody,
            mediaType: 'application/json',
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
     * @returns void
     * @throws ApiError
     */
    public static deleteApiCollections(
        collectionId: string,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/collections/{collectionId}',
            path: {
                'collectionId': collectionId,
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
     * @returns any Collection status
     * @throws ApiError
     */
    public static getApiCollectionsStatus(
        collectionId: string,
    ): CancelablePromise<{
        status: string;
        fileCount: number;
        totalSize: number;
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/collections/{collectionId}/status',
            path: {
                'collectionId': collectionId,
            },
            errors: {
                401: `Unauthorized`,
                404: `Not Found`,
            },
        });
    }
}
