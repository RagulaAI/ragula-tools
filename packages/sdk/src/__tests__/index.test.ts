import Ragula from "../index";
import { doFetch } from "../utils/api";
import { tryCatch } from "../utils/tryCatch";
import collectionHandler from "../handlers/collectionHandler";
import * as ApiTypes from "../types";

// Mock the dependencies
jest.mock("../utils/api");
jest.mock("../utils/tryCatch", () => ({
  tryCatch: jest.fn((fn) =>
    fn
      .then((data: any) => ({ data, error: null }))
      .catch((error: any) => ({ data: null, error }))
  ),
}));
jest.mock("../handlers/collectionHandler");

const mockDoFetch = doFetch as jest.Mock;
const mockCollectionHandler = collectionHandler as jest.Mock;

describe("Ragula SDK Client", () => {
  const apiKey = "test-api-key";
  let ragula: Ragula;

  beforeEach(() => {
    // Reset mocks before each test
    mockDoFetch.mockClear();
    mockCollectionHandler.mockClear();
    (tryCatch as jest.Mock).mockClear();
    ragula = new Ragula(apiKey);
  });

  it("should store the API key upon instantiation", () => {
    expect(ragula.apiKey).toBe(apiKey);
  });

  describe("listCollections", () => {
    it("should call doFetch with correct parameters and return data on success", async () => {
      const mockDate = new Date();
      const mockResponse: ApiTypes.ListCollectionsResponse = [
        {
          id: "col1",
          name: "Test Collection",
          description: null,
          userId: "user1",
          createdAt: mockDate,
          updatedAt: mockDate,
          datastoreId: "ds1",
        },
      ];
      mockDoFetch.mockResolvedValueOnce(mockResponse);

      const result = await ragula.listCollections();

      expect(mockDoFetch).toHaveBeenCalledTimes(1);
      expect(mockDoFetch).toHaveBeenCalledWith("collections", apiKey);
      expect(result).toEqual(mockResponse);
      expect(tryCatch).toHaveBeenCalledTimes(1);
    });

    it("should throw an error if doFetch fails", async () => {
      const mockError = new Error("API Error");
      mockDoFetch.mockRejectedValueOnce(mockError);

      await expect(ragula.listCollections()).rejects.toThrow(mockError);

      expect(mockDoFetch).toHaveBeenCalledTimes(1);
      expect(mockDoFetch).toHaveBeenCalledWith("collections", apiKey);
      expect(tryCatch).toHaveBeenCalledTimes(1);
    });
  });

  describe("createCollection", () => {
    const name = "New Collection";
    const description = "A description";
    const payload: ApiTypes.CreateCollectionPayload = { name, description };

    it("should call doFetch with correct parameters and payload, returning data on success", async () => {
      const mockDate = new Date();
      const mockResponse: ApiTypes.CreateCollectionResponse = {
        id: "newCol1",
        name: name,
        description: description,
        userId: "user1",
        createdAt: mockDate,
        updatedAt: mockDate,
        datastoreId: "ds-new1",
      };
      mockDoFetch.mockResolvedValueOnce(mockResponse);

      const result = await ragula.createCollection(name, description);

      expect(mockDoFetch).toHaveBeenCalledTimes(1);
      expect(mockDoFetch).toHaveBeenCalledWith("collections", apiKey, {
        method: "POST",
        body: JSON.stringify(payload),
      });
      expect(result).toEqual(mockResponse);
      expect(tryCatch).toHaveBeenCalledTimes(1);
    });

    it("should handle null description correctly", async () => {
      const mockDate = new Date();
      const mockResponse: ApiTypes.CreateCollectionResponse = {
        id: "newCol2",
        name: name,
        description: null,
        userId: "user1",
        createdAt: mockDate,
        updatedAt: mockDate,
        datastoreId: "ds-new2",
      };
      const nullDescPayload: ApiTypes.CreateCollectionPayload = {
        name,
        description: null,
      };
      mockDoFetch.mockResolvedValueOnce(mockResponse);

      const result = await ragula.createCollection(name, null);

      expect(mockDoFetch).toHaveBeenCalledTimes(1);
      expect(mockDoFetch).toHaveBeenCalledWith("collections", apiKey, {
        method: "POST",
        body: JSON.stringify(nullDescPayload),
      });
      expect(result).toEqual(mockResponse);
      expect(tryCatch).toHaveBeenCalledTimes(1);
    });

    it("should throw an error if doFetch fails", async () => {
      const mockError = new Error("API Creation Error");
      mockDoFetch.mockRejectedValueOnce(mockError);

      await expect(ragula.createCollection(name, description)).rejects.toThrow(
        mockError
      );

      expect(mockDoFetch).toHaveBeenCalledTimes(1);
      expect(mockDoFetch).toHaveBeenCalledWith("collections", apiKey, {
        method: "POST",
        body: JSON.stringify(payload),
      });
      expect(tryCatch).toHaveBeenCalledTimes(1);
    });
  });

  // Additional tests for handlers could be added here
  // For example:
  /*
  describe("Collection Handler", () => {
    const apiKey = "test-api-key";
    const collectionId = "col-123";
    let handler;
  
    beforeEach(() => {
      mockDoFetch.mockClear();
      (tryCatch as jest.Mock).mockClear();
      handler = collectionHandler(collectionId, apiKey);
    });
  
    it("should call doFetch with correct parameters for query", async () => {
      const queryText = "test query";
      const mockResponse = { results: [] };
      mockDoFetch.mockResolvedValueOnce(mockResponse);
  
      const result = await handler.query(queryText);
  
      expect(mockDoFetch).toHaveBeenCalledWith(
        `collections/${collectionId}/query`,
        apiKey,
        {
          method: "POST",
          body: JSON.stringify({ query: queryText }),
        }
      );
      expect(result).toEqual(mockResponse);
    });
  
    // Additional tests for other methods...
  });
  */

  describe("collection", () => {
    it("should call collectionHandler with the correct collectionId and apiKey", () => {
      const collectionId = "col-abc";
      const mockHandlerInstance = { listFiles: jest.fn() }; // Mock instance returned by handler
      mockCollectionHandler.mockReturnValueOnce(mockHandlerInstance);

      const handler = ragula.collection(collectionId);

      expect(mockCollectionHandler).toHaveBeenCalledTimes(1);
      expect(mockCollectionHandler).toHaveBeenCalledWith(collectionId, apiKey);
      expect(handler).toBe(mockHandlerInstance);
    });
  });
});
