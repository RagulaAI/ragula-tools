import collectionHandler from "../handlers/collectionHandler";
import { doFetch } from "../utils/api";
import { tryCatch } from "../utils/tryCatch";
import * as ApiTypes from "../types";
import foldersHandler from "../handlers/foldersHandler";

// Mock the dependencies
jest.mock("../utils/api");
jest.mock("../utils/tryCatch", () => ({
  tryCatch: jest.fn((fn) =>
    fn
      .then((data: any) => ({ data, error: null }))
      .catch((error: any) => ({ data: null, error }))
  ),
}));
jest.mock("../handlers/foldersHandler");

const mockDoFetch = doFetch as jest.Mock;
const mockFoldersHandler = foldersHandler as jest.Mock;

describe("Collection Handler", () => {
  const apiKey = "test-api-key";
  const collectionId = "col-123";
  let handler: ReturnType<typeof collectionHandler>;

  beforeEach(() => {
    mockDoFetch.mockClear();
    mockFoldersHandler.mockClear();
    (tryCatch as jest.Mock).mockClear();
    handler = collectionHandler(collectionId, apiKey);
  });

  describe("query", () => {
    it("should call doFetch with correct parameters", async () => {
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

    it("should throw an error if doFetch fails", async () => {
      const queryText = "test query";
      const mockError = new Error("Query Error");
      mockDoFetch.mockRejectedValueOnce(mockError);

      await expect(handler.query(queryText)).rejects.toThrow(mockError);
    });
  });

  describe("details", () => {
    it("should call doFetch with correct parameters", async () => {
      const mockDate = new Date();
      const mockResponse: ApiTypes.Collection = {
        id: collectionId,
        name: "Test Collection",
        description: null,
        userId: "user1",
        createdAt: mockDate,
        updatedAt: mockDate,
        datastoreId: "ds1",
      };
      mockDoFetch.mockResolvedValueOnce(mockResponse);

      const result = await handler.details();

      expect(mockDoFetch).toHaveBeenCalledWith(
        `collections/${collectionId}`,
        apiKey
      );
      expect(result).toEqual(mockResponse);
    });
  });

  describe("status", () => {
    it("should call doFetch with correct parameters", async () => {
      const mockResponse: ApiTypes.CollectionStatus = {
        status: "ready",
        fileCount: 10,
        totalSize: 1024,
      };
      mockDoFetch.mockResolvedValueOnce(mockResponse);

      const result = await handler.status();

      expect(mockDoFetch).toHaveBeenCalledWith(
        `collections/${collectionId}/status`,
        apiKey
      );
      expect(result).toEqual(mockResponse);
    });
  });

  describe("update", () => {
    it("should call doFetch with correct parameters", async () => {
      const mockDate = new Date();
      const payload: ApiTypes.UpdateCollectionPayload = {
        name: "Updated Collection",
        description: "New description",
      };
      const mockResponse: ApiTypes.Collection = {
        id: collectionId,
        name: payload.name!,
        description: payload.description!,
        userId: "user1",
        createdAt: mockDate,
        updatedAt: mockDate,
        datastoreId: "ds1",
      };
      mockDoFetch.mockResolvedValueOnce(mockResponse);

      const result = await handler.update(payload);

      expect(mockDoFetch).toHaveBeenCalledWith(
        `collections/${collectionId}`,
        apiKey,
        {
          method: "PUT",
          body: JSON.stringify(payload),
        }
      );
      expect(result).toEqual(mockResponse);
    });
  });

  describe("delete", () => {
    it("should call doFetch with correct parameters", async () => {
      mockDoFetch.mockResolvedValueOnce(undefined);

      await handler.delete();

      expect(mockDoFetch).toHaveBeenCalledWith(
        `collections/${collectionId}`,
        apiKey,
        {
          method: "DELETE",
        }
      );
    });
  });

  describe("listFolders", () => {
    it("should call doFetch with correct parameters", async () => {
      const mockDate = new Date();
      const mockResponse: ApiTypes.Folder[] = [
        {
          id: "folder1",
          name: "Test Folder",
          parentId: null,
          collectionId,
          createdAt: mockDate,
          updatedAt: mockDate,
        },
      ];
      mockDoFetch.mockResolvedValueOnce(mockResponse);

      const result = await handler.listFolders();

      expect(mockDoFetch).toHaveBeenCalledWith(
        `collections/${collectionId}/folders`,
        apiKey
      );
      expect(result).toEqual(mockResponse);
    });
  });

  describe("createFolder", () => {
    it("should call doFetch with correct parameters", async () => {
      const mockDate = new Date();
      const payload: ApiTypes.CreateFolderPayload = {
        name: "New Folder",
        parentId: null,
      };
      const mockResponse: ApiTypes.Folder = {
        id: "folder1",
        name: payload.name,
        parentId: payload.parentId,
        collectionId,
        createdAt: mockDate,
        updatedAt: mockDate,
      };
      mockDoFetch.mockResolvedValueOnce(mockResponse);

      const result = await handler.createFolder(payload);

      expect(mockDoFetch).toHaveBeenCalledWith(
        `collections/${collectionId}/folders`,
        apiKey,
        {
          method: "POST",
          body: JSON.stringify(payload),
        }
      );
      expect(result).toEqual(mockResponse);
    });
  });

  describe("folder", () => {
    it("should call foldersHandler with correct parameters", () => {
      const folderId = "folder1";
      const mockHandlerInstance = { delete: jest.fn() };
      mockFoldersHandler.mockReturnValueOnce(mockHandlerInstance);

      const result = handler.folder(folderId);

      expect(mockFoldersHandler).toHaveBeenCalledWith(
        collectionId,
        folderId,
        apiKey
      );
      expect(result).toBe(mockHandlerInstance);
    });
  });

  describe("listFiles", () => {
    it("should call doFetch with correct parameters", async () => {
      const mockResponse = [{ id: "file1", name: "test.txt" }];
      mockDoFetch.mockResolvedValueOnce(mockResponse);

      const result = await handler.listFiles();

      expect(mockDoFetch).toHaveBeenCalledWith(
        `collections/${collectionId}/files`,
        apiKey
      );
      expect(result).toEqual(mockResponse);
    });
  });

  describe("uploadFile", () => {
    it("should call doFetch with correct parameters", async () => {
      const mockFile = new File(["test content"], "test.txt", {
        type: "text/plain",
      });
      const mockResponse = { id: "file1", name: "test.txt" };
      mockDoFetch.mockResolvedValueOnce(mockResponse);

      const result = await handler.uploadFile(mockFile);

      expect(mockDoFetch).toHaveBeenCalledWith(
        `collections/${collectionId}/files`,
        apiKey,
        {
          method: "POST",
          body: expect.any(FormData),
        }
      );
      expect(result).toEqual(mockResponse);
    });
  });
});
