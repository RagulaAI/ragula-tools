import { CollectionsService } from "../src/services/CollectionsService";
import { request as __request } from "../src/core/request";
import { OpenAPI } from "../src/core/OpenAPI";
import { ApiError } from "../src/core/ApiError";
import { Result } from "../src/utils/tryCatch";

jest.mock("../src/core/request", () => ({
  request: jest.fn(),
}));

const mockRequest = __request as jest.Mock;

type Collection = {
  id: string;
  name: string;
  description: string | null;
  userId: string;
  createdAt: string;
  updatedAt: string;
  datastoreId: string | null;
};

describe("CollectionsService", () => {
  beforeEach(() => {
    mockRequest.mockClear();
  });

  const collectionId = "test-coll-id";
  const sampleCollection: Collection = {
    id: collectionId,
    name: "Test Collection",
    description: "A collection for testing",
    userId: "user1",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    datastoreId: "ds1",
  };
  const sampleCollectionList: Collection[] = [sampleCollection];
  const sampleStatus = { status: "processed", fileCount: 10, totalSize: 1024 };
  const apiError = new ApiError({} as any, {} as any, "API Error");

  describe("getApiCollections", () => {
    it("should list collections successfully", async () => {
      const expectedResult: Result<Collection[], ApiError> = {
        data: sampleCollectionList,
        error: null,
      };
      mockRequest.mockResolvedValue(expectedResult);

      const resultPromise = CollectionsService.getApiCollections();
      await expect(resultPromise).resolves.toEqual(expectedResult);

      expect(mockRequest).toHaveBeenCalledTimes(1);
      expect(mockRequest).toHaveBeenCalledWith(OpenAPI, {
        method: "GET",
        url: "/api/collections",
        errors: { 401: `Unauthorized` },
      });
    });

    it("should handle errors when listing collections", async () => {
      const expectedResult: Result<Collection[], ApiError> = {
        data: null,
        error: apiError,
      };
      mockRequest.mockResolvedValue(expectedResult);

      const resultPromise = CollectionsService.getApiCollections();
      await expect(resultPromise).resolves.toEqual(expectedResult);
      expect(mockRequest).toHaveBeenCalledTimes(1);
    });
  });

  describe("postApiCollections", () => {
    const createPayload = { name: "New Collection", description: "New Desc" };
    const expectedResult: Result<Collection, ApiError> = {
      data: sampleCollection,
      error: null,
    };

    it("should create a collection successfully", async () => {
      mockRequest.mockResolvedValue(expectedResult);

      const resultPromise =
        CollectionsService.postApiCollections(createPayload);
      await expect(resultPromise).resolves.toEqual(expectedResult);

      expect(mockRequest).toHaveBeenCalledTimes(1);
      expect(mockRequest).toHaveBeenCalledWith(OpenAPI, {
        method: "POST",
        url: "/api/collections",
        body: createPayload,
        mediaType: "application/json",
        errors: { 400: `Bad Request`, 401: `Unauthorized` },
      });
    });

    it("should handle errors when creating a collection", async () => {
      const expectedErrorResult: Result<Collection, ApiError> = {
        data: null,
        error: apiError,
      };
      mockRequest.mockResolvedValue(expectedErrorResult);

      const resultPromise =
        CollectionsService.postApiCollections(createPayload);
      await expect(resultPromise).resolves.toEqual(expectedErrorResult);
      expect(mockRequest).toHaveBeenCalledTimes(1);
    });
  });

  describe("getApiCollectionById", () => {
    const expectedResult: Result<Collection, ApiError> = {
      data: sampleCollection,
      error: null,
    };

    it("should get a collection by ID successfully", async () => {
      mockRequest.mockResolvedValue(expectedResult);

      const resultPromise =
        CollectionsService.getApiCollectionById(collectionId);
      await expect(resultPromise).resolves.toEqual(expectedResult);

      expect(mockRequest).toHaveBeenCalledTimes(1);
      expect(mockRequest).toHaveBeenCalledWith(OpenAPI, {
        method: "GET",
        url: "/api/collections/{collectionId}",
        path: { collectionId },
        errors: { 401: `Unauthorized`, 404: `Not Found` },
      });
    });

    it("should handle errors when getting a collection by ID", async () => {
      const expectedErrorResult: Result<Collection, ApiError> = {
        data: null,
        error: apiError,
      };
      mockRequest.mockResolvedValue(expectedErrorResult);

      const resultPromise =
        CollectionsService.getApiCollectionById(collectionId);
      await expect(resultPromise).resolves.toEqual(expectedErrorResult);
      expect(mockRequest).toHaveBeenCalledTimes(1);
    });
  });

  describe("putApiCollections", () => {
    const updatePayload = { name: "Updated Name", description: null };
    const expectedResult: Result<Collection, ApiError> = {
      data: { ...sampleCollection, ...updatePayload },
      error: null,
    };

    it("should update a collection successfully", async () => {
      mockRequest.mockResolvedValue(expectedResult);

      const resultPromise = CollectionsService.putApiCollections(
        collectionId,
        updatePayload
      );
      await expect(resultPromise).resolves.toEqual(expectedResult);

      expect(mockRequest).toHaveBeenCalledTimes(1);
      expect(mockRequest).toHaveBeenCalledWith(OpenAPI, {
        method: "PUT",
        url: "/api/collections/{collectionId}",
        path: { collectionId },
        body: updatePayload,
        mediaType: "application/json",
        errors: { 400: `Bad Request`, 401: `Unauthorized`, 404: `Not Found` },
      });
    });

    it("should handle errors when updating a collection", async () => {
      const expectedErrorResult: Result<Collection, ApiError> = {
        data: null,
        error: apiError,
      };
      mockRequest.mockResolvedValue(expectedErrorResult);

      const resultPromise = CollectionsService.putApiCollections(
        collectionId,
        updatePayload
      );
      await expect(resultPromise).resolves.toEqual(expectedErrorResult);
      expect(mockRequest).toHaveBeenCalledTimes(1);
    });
  });

  describe("deleteApiCollections", () => {
    const expectedResult: Result<void, ApiError> = {
      data: undefined,
      error: null,
    };

    it("should delete a collection successfully", async () => {
      mockRequest.mockResolvedValue(expectedResult);

      const resultPromise =
        CollectionsService.deleteApiCollections(collectionId);
      await expect(resultPromise).resolves.toEqual(expectedResult);

      expect(mockRequest).toHaveBeenCalledTimes(1);
      expect(mockRequest).toHaveBeenCalledWith(OpenAPI, {
        method: "DELETE",
        url: "/api/collections/{collectionId}",
        path: { collectionId },
        errors: { 401: `Unauthorized`, 404: `Not Found` },
      });
    });

    it("should handle errors when deleting a collection", async () => {
      const expectedErrorResult: Result<void, ApiError> = {
        data: null,
        error: apiError,
      };
      mockRequest.mockResolvedValue(expectedErrorResult);

      const resultPromise =
        CollectionsService.deleteApiCollections(collectionId);
      await expect(resultPromise).resolves.toEqual(expectedErrorResult);
      expect(mockRequest).toHaveBeenCalledTimes(1);
    });
  });

  describe("getApiCollectionsStatus", () => {
    const expectedResult: Result<typeof sampleStatus, ApiError> = {
      data: sampleStatus,
      error: null,
    };

    it("should get collection status successfully", async () => {
      mockRequest.mockResolvedValue(expectedResult);

      const resultPromise =
        CollectionsService.getApiCollectionsStatus(collectionId);
      await expect(resultPromise).resolves.toEqual(expectedResult);

      expect(mockRequest).toHaveBeenCalledTimes(1);
      expect(mockRequest).toHaveBeenCalledWith(OpenAPI, {
        method: "GET",
        url: "/api/collections/{collectionId}/status",
        path: { collectionId },
        errors: { 401: `Unauthorized`, 404: `Not Found` },
      });
    });

    it("should handle errors when getting collection status", async () => {
      const expectedErrorResult: Result<typeof sampleStatus, ApiError> = {
        data: null,
        error: apiError,
      };
      mockRequest.mockResolvedValue(expectedErrorResult);

      const resultPromise =
        CollectionsService.getApiCollectionsStatus(collectionId);
      await expect(resultPromise).resolves.toEqual(expectedErrorResult);
      expect(mockRequest).toHaveBeenCalledTimes(1);
    });
  });
});
