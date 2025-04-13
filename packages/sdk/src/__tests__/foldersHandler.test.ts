import foldersHandler from "../handlers/foldersHandler";
import { doFetch } from "../utils/api";
import { tryCatch } from "../utils/tryCatch";
import filesHandler from "../handlers/filesHandler";
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
jest.mock("../handlers/filesHandler");

const mockDoFetch = doFetch as jest.Mock;
const mockFilesHandler = filesHandler as jest.Mock;

describe("Folders Handler", () => {
  const apiKey = "test-api-key";
  const collectionId = "col-123";
  const folderId = "folder-456";
  let handler: ReturnType<typeof foldersHandler>;

  beforeEach(() => {
    mockDoFetch.mockClear();
    mockFilesHandler.mockClear();
    (tryCatch as jest.Mock).mockClear();
    handler = foldersHandler(collectionId, folderId, apiKey);
  });

  describe("delete", () => {
    it("should call doFetch with correct parameters", async () => {
      mockDoFetch.mockResolvedValueOnce(undefined);

      const result = await handler.delete();
      // Assuming successful delete resolves with undefined data via tryCatch
      expect(result).toEqual({ data: undefined, error: null });

      expect(mockDoFetch).toHaveBeenCalledWith(
        `collections/${collectionId}/folders/${folderId}`,
        apiKey,
        { method: "DELETE" }
      );
    });

    it("should throw an error if doFetch fails", async () => {
      const mockError = new Error("Delete Error");
      mockDoFetch.mockRejectedValueOnce(mockError);

      const result = await handler.delete();
      expect(result).toEqual({ data: null, error: mockError });
    });
  });

  describe("listFiles", () => {
    it("should call doFetch with correct parameters", async () => {
      const mockResponse: ApiTypes.FileListingResponse = {
        items: [
          {
            id: "file1",
            name: "test.txt",
            type: "text/plain",
            size: 1024,
            collectionId,
            folderId,
            createdAt: new Date(),
            updatedAt: new Date(),
            storagePath: "path/to/file",
          },
        ],
      };
      mockDoFetch.mockResolvedValueOnce(mockResponse);

      const result = await handler.listFiles();

      expect(mockDoFetch).toHaveBeenCalledWith(
        `collections/${collectionId}/files?folderId=${folderId}`,
        apiKey,
        { method: "GET" }
      );
      expect(result).toEqual({ data: mockResponse, error: null });
    });

    it("should throw an error if doFetch fails", async () => {
      const mockError = new Error("List Files Error");
      mockDoFetch.mockRejectedValueOnce(mockError);

      const result = await handler.listFiles();
      expect(result).toEqual({ data: null, error: mockError });
    });
  });

  describe("file", () => {
    it("should call filesHandler with correct parameters", () => {
      const fileId = "file-789";
      const mockHandlerInstance = { delete: jest.fn() };
      mockFilesHandler.mockReturnValueOnce(mockHandlerInstance);

      const result = handler.file(fileId);

      expect(mockFilesHandler).toHaveBeenCalledWith(
        collectionId,
        fileId,
        apiKey
      );
      expect(result).toBe(mockHandlerInstance);
    });
  });
});
