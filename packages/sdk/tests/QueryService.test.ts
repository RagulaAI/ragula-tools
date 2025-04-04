import { QueryService } from "../src/services/QueryService";
import { request as __request } from "../src/core/request";
import { OpenAPI } from "../src/core/OpenAPI";

jest.mock("../src/core/request", () => ({
  request: jest.fn(),
}));

const mockRequest = __request as jest.Mock;

describe("QueryService", () => {
  beforeEach(() => {
    mockRequest.mockClear();
  });

  it("should call the query endpoint with correct parameters", async () => {
    const collectionId = "test-collection-id";
    const requestBody = {
      query: "test query",
      topK: 5,
      filter: {
        folderIds: ["folder1"],
        fileTypes: [".txt"],
      },
    };
    const expectedResult = {
      results: [{ fileId: "file1", score: 0.9, contentSnippet: "..." }],
    };

    mockRequest.mockResolvedValue(expectedResult);

    const resultPromise = QueryService.postApiCollectionsQuery(
      collectionId,
      requestBody
    );

    await expect(resultPromise).resolves.toEqual(expectedResult);

    expect(mockRequest).toHaveBeenCalledTimes(1);
    expect(mockRequest).toHaveBeenCalledWith(OpenAPI, {
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
  });

  it("should call the query endpoint without optional parameters", async () => {
    const collectionId = "test-collection-id-simple";
    const requestBody = { query: "simple query" }; // Only mandatory query field
    const expectedResult = { results: [{ fileId: "file2", score: 0.8 }] };

    mockRequest.mockResolvedValue(expectedResult);

    const resultPromise = QueryService.postApiCollectionsQuery(
      collectionId,
      requestBody
    );

    await expect(resultPromise).resolves.toEqual(expectedResult);

    expect(mockRequest).toHaveBeenCalledTimes(1);
    expect(mockRequest).toHaveBeenCalledWith(OpenAPI, {
      method: "POST",
      url: "/api/collections/{collectionId}/query",
      path: {
        collectionId: collectionId,
      },
      body: requestBody, // Should contain only the query
      mediaType: "application/json",
      errors: {
        400: `Bad Request`,
        401: `Unauthorized`,
        404: `Not Found`,
      },
    });
  });

  it("should handle API errors", async () => {
    const collectionId = "test-collection-error";
    const requestBody = { query: "error query" };
    const apiError = new Error("API Error 404"); // Simulate an error

    mockRequest.mockRejectedValue(apiError);

    const resultPromise = QueryService.postApiCollectionsQuery(
      collectionId,
      requestBody
    );

    await expect(resultPromise).rejects.toThrow("API Error 404");

    expect(mockRequest).toHaveBeenCalledTimes(1);
    expect(mockRequest).toHaveBeenCalledWith(OpenAPI, {
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
  });
});
