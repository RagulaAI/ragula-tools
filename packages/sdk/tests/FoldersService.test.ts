import { FoldersService } from "../src/services/FoldersService";
import { request as __request } from "../src/core/request";
import { OpenAPI } from "../src/core/OpenAPI";
import { ApiError } from "../src/core/ApiError";

jest.mock("../src/core/request", () => ({
  request: jest.fn(),
}));

const mockRequest = __request as jest.Mock;

type Folder = {
  id: string;
  name: string;
  parentId: string | null;
  collectionId: string;
  createdAt: string;
  updatedAt: string;
};

describe("FoldersService", () => {
  beforeEach(() => {
    mockRequest.mockClear();
  });

  const collectionId = "test-coll-id";
  const parentFolderId = "parent-folder-id";
  const folderId = "test-folder-id";
  const sampleFolder: Folder = {
    id: folderId,
    name: "Test Folder",
    parentId: parentFolderId,
    collectionId: collectionId,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  const sampleRootFolder: Folder = {
    id: "root-folder-id",
    name: "Root Folder",
    parentId: null,
    collectionId: collectionId,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  const sampleFolderList: Folder[] = [sampleFolder, sampleRootFolder];
  const apiError = new Error("API Error");

  describe("getApiCollectionsFolders", () => {
    it("should list all folders in a collection successfully", async () => {
      mockRequest.mockResolvedValue(sampleFolderList);

      const resultPromise =
        FoldersService.getApiCollectionsFolders(collectionId);
      await expect(resultPromise).resolves.toEqual(sampleFolderList);

      expect(mockRequest).toHaveBeenCalledTimes(1);
      expect(mockRequest).toHaveBeenCalledWith(OpenAPI, {
        method: "GET",
        url: "/api/collections/{collectionId}/folders",
        path: { collectionId },
        query: { parentId: undefined },
        errors: { 401: `Unauthorized`, 404: `Collection Not Found` },
      });
    });

    it("should list folders under a specific parent folder successfully", async () => {
      const subFolderList = [sampleFolder];
      mockRequest.mockResolvedValue(subFolderList);

      const resultPromise = FoldersService.getApiCollectionsFolders(
        collectionId,
        parentFolderId
      );
      await expect(resultPromise).resolves.toEqual(subFolderList);

      expect(mockRequest).toHaveBeenCalledTimes(1);
      expect(mockRequest).toHaveBeenCalledWith(OpenAPI, {
        method: "GET",
        url: "/api/collections/{collectionId}/folders",
        path: { collectionId },
        query: { parentId: parentFolderId },
        errors: { 401: `Unauthorized`, 404: `Collection Not Found` },
      });
    });

    it("should handle errors when listing folders", async () => {
      mockRequest.mockRejectedValue(apiError);

      const resultPromise =
        FoldersService.getApiCollectionsFolders(collectionId);
      await expect(resultPromise).rejects.toThrow(apiError);
      expect(mockRequest).toHaveBeenCalledTimes(1);
    });
  });

  describe("postApiCollectionsFolders", () => {
    const createPayload = { name: "New Folder", parentId: parentFolderId };
    const createRootPayload = { name: "New Root Folder", parentId: null };

    it("should create a sub-folder successfully", async () => {
      mockRequest.mockResolvedValue(sampleFolder);

      const resultPromise = FoldersService.postApiCollectionsFolders(
        collectionId,
        createPayload
      );
      await expect(resultPromise).resolves.toEqual(sampleFolder);

      expect(mockRequest).toHaveBeenCalledTimes(1);
      expect(mockRequest).toHaveBeenCalledWith(OpenAPI, {
        method: "POST",
        url: "/api/collections/{collectionId}/folders",
        path: { collectionId },
        body: createPayload,
        mediaType: "application/json",
        errors: {
          400: `Bad Request`,
          401: `Unauthorized`,
          404: `Collection or Parent Folder Not Found`,
        },
      });
    });

    it("should create a root folder successfully", async () => {
      mockRequest.mockResolvedValue(sampleRootFolder);

      const resultPromise = FoldersService.postApiCollectionsFolders(
        collectionId,
        createRootPayload
      );
      await expect(resultPromise).resolves.toEqual(sampleRootFolder);

      expect(mockRequest).toHaveBeenCalledTimes(1);
      expect(mockRequest).toHaveBeenCalledWith(OpenAPI, {
        method: "POST",
        url: "/api/collections/{collectionId}/folders",
        path: { collectionId },
        body: createRootPayload,
        mediaType: "application/json",
        errors: {
          400: `Bad Request`,
          401: `Unauthorized`,
          404: `Collection or Parent Folder Not Found`,
        },
      });
    });

    it("should handle errors when creating a folder", async () => {
      mockRequest.mockRejectedValue(apiError);

      const resultPromise = FoldersService.postApiCollectionsFolders(
        collectionId,
        createPayload
      );
      await expect(resultPromise).rejects.toThrow(apiError);
      expect(mockRequest).toHaveBeenCalledTimes(1);
    });
  });

  describe("deleteApiCollectionsFolders", () => {
    it("should delete a folder successfully", async () => {
      mockRequest.mockResolvedValue(undefined);

      const resultPromise = FoldersService.deleteApiCollectionsFolders(
        collectionId,
        folderId
      );
      await expect(resultPromise).resolves.toBeUndefined();

      expect(mockRequest).toHaveBeenCalledTimes(1);
      expect(mockRequest).toHaveBeenCalledWith(OpenAPI, {
        method: "DELETE",
        url: "/api/collections/{collectionId}/folders/{folderId}",
        path: { collectionId, folderId },
        errors: { 401: `Unauthorized`, 404: `Not Found` },
      });
    });

    it("should handle errors when deleting a folder", async () => {
      mockRequest.mockRejectedValue(apiError);

      const resultPromise = FoldersService.deleteApiCollectionsFolders(
        collectionId,
        folderId
      );
      await expect(resultPromise).rejects.toThrow(apiError);
      expect(mockRequest).toHaveBeenCalledTimes(1);
    });
  });
});
