import collectionHandler from "../handlers/collectionHandler";
import { doFetch } from "../utils/api";
import { tryCatch } from "../utils/tryCatch";
import * as ApiTypes from "../types";
import foldersHandler from "../handlers/foldersHandler";
import linksHandler from "../handlers/linksHandler";

jest.mock("../utils/api");
jest.mock("../utils/tryCatch", () => ({
  tryCatch: jest.fn((fn) =>
    fn
      .then((data: any) => ({ data, error: null }))
      .catch((error: any) => ({ data: null, error }))
  ),
}));
jest.mock("../handlers/foldersHandler");
jest.mock("../handlers/linksHandler");

const mockDoFetch = doFetch as jest.Mock;
const mockFoldersHandler = foldersHandler as jest.Mock;
const mockLinksHandler = linksHandler as jest.Mock;

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
      expect(result).toEqual({ data: mockResponse, error: null });
    });

    it("should throw an error if doFetch fails", async () => {
      const queryText = "test query";
      const mockError = new Error("Query Error");
      mockDoFetch.mockRejectedValueOnce(mockError);

      const result = await handler.query(queryText);
      expect(result).toEqual({ data: null, error: mockError });
    });
  });

  describe("question", () => {
    it("should call doFetch with correct parameters", async () => {
      const questionText = "test question";
      const mockResponse: ApiTypes.AskQuestionResponse = {
        answer: "This is the answer to your question",
      };
      mockDoFetch.mockResolvedValueOnce(mockResponse);

      const result = await handler.question(questionText);

      expect(mockDoFetch).toHaveBeenCalledWith(
        `collections/${collectionId}/question`,
        apiKey,
        {
          method: "POST",
          body: JSON.stringify({ question: questionText }),
        }
      );
      expect(result).toEqual({ data: mockResponse, error: null });
    });

    it("should return an error if doFetch fails", async () => {
      const questionText = "test question";
      const mockError = new Error("Question Error");
      mockDoFetch.mockRejectedValueOnce(mockError);

      const result = await handler.question(questionText);
      expect(result).toEqual({ data: null, error: mockError });
      expect(mockDoFetch).toHaveBeenCalledWith(
        `collections/${collectionId}/question`,
        apiKey,
        {
          method: "POST",
          body: JSON.stringify({ question: questionText }),
        }
      );
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
      expect(result).toEqual({ data: mockResponse, error: null });
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
      expect(result).toEqual({ data: mockResponse, error: null });
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
      expect(result).toEqual({ data: mockResponse, error: null });
    });
  });

  describe("delete", () => {
    it("should call doFetch with correct parameters", async () => {
      mockDoFetch.mockResolvedValueOnce(undefined);

      const result = await handler.delete();
      expect(result).toEqual({ data: undefined, error: null });

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
    it("should call doFetch with correct parameters without parentId", async () => {
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
      expect(result).toEqual({ data: mockResponse, error: null });
    });

    it("should call doFetch with correct parameters with parentId", async () => {
      const parentId = "parent-folder-123";
      const mockDate = new Date();
      const mockResponse: ApiTypes.Folder[] = [
        {
          id: "folder1",
          name: "Test Folder",
          parentId: parentId,
          collectionId,
          createdAt: mockDate,
          updatedAt: mockDate,
        },
      ];
      mockDoFetch.mockResolvedValueOnce(mockResponse);

      const result = await handler.listFolders(parentId);

      expect(mockDoFetch).toHaveBeenCalledWith(
        `collections/${collectionId}/folders?parentId=${parentId}`,
        apiKey
      );
      expect(result).toEqual({ data: mockResponse, error: null });
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
      expect(result).toEqual({ data: mockResponse, error: null });
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
    it("should call doFetch with correct parameters without folderId", async () => {
      const mockResponse: ApiTypes.FileListingResponse = {
        items: [
          {
            id: "file1",
            name: "test.txt",
            type: "text/plain",
            size: 1024,
            collectionId,
            folderId: null,
            createdAt: new Date(),
            updatedAt: new Date(),
            storagePath: "path/to/file",
          },
        ],
      };
      mockDoFetch.mockResolvedValueOnce(mockResponse);

      const result = await handler.listFiles();

      expect(mockDoFetch).toHaveBeenCalledWith(
        `collections/${collectionId}/files`,
        apiKey
      );
      expect(result).toEqual({ data: mockResponse, error: null });
    });

    it("should call doFetch with correct parameters with folderId", async () => {
      const folderId = "folder-123";
      const mockResponse: ApiTypes.FileListingResponse = {
        items: [
          {
            id: "file1",
            name: "test.txt",
            type: "text/plain",
            size: 1024,
            collectionId,
            folderId: folderId,
            createdAt: new Date(),
            updatedAt: new Date(),
            storagePath: "path/to/file",
          },
        ],
      };
      mockDoFetch.mockResolvedValueOnce(mockResponse);

      const result = await handler.listFiles(folderId);

      expect(mockDoFetch).toHaveBeenCalledWith(
        `collections/${collectionId}/files?folderId=${folderId}`,
        apiKey
      );
      expect(result).toEqual({ data: mockResponse, error: null });
    });
  });

  describe("uploadFile", () => {
    it("should call doFetch with correct parameters without folderId", async () => {
      const mockFile = new File(["test content"], "test.txt", {
        type: "text/plain",
      });
      const mockResponse: ApiTypes.File = {
        id: "file1",
        name: "test.txt",
        type: "text/plain",
        size: 1024,
        collectionId,
        folderId: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        storagePath: "path/to/file",
      };
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
      expect(result).toEqual({ data: mockResponse, error: null });
    });

    it("should call doFetch with correct parameters with folderId", async () => {
      const mockFile = new File(["test content"], "test.txt", {
        type: "text/plain",
      });
      const folderId = "folder-123";
      const mockResponse: ApiTypes.File = {
        id: "file1",
        name: "test.txt",
        type: "text/plain",
        size: 1024,
        collectionId,
        folderId: folderId,
        createdAt: new Date(),
        updatedAt: new Date(),
        storagePath: "path/to/file",
      };
      mockDoFetch.mockResolvedValueOnce(mockResponse);

      const result = await handler.uploadFile(mockFile, folderId);

      // Check that FormData contains the folderId
      const formDataMock = mockDoFetch.mock.calls[0][2].body;
      expect(formDataMock.get("folderId")).toBe(folderId);

      expect(mockDoFetch).toHaveBeenCalledWith(
        `collections/${collectionId}/files`,
        apiKey,
        {
          method: "POST",
          body: expect.any(FormData),
        }
      );
      expect(result).toEqual({ data: mockResponse, error: null });
    });
  });

  describe("createLink", () => {
    it("should call doFetch with correct parameters without folderId", async () => {
      const payload: ApiTypes.LinkCreateRequest = {
        name: "Test Link",
        url: "https://example.com",
      };
      const mockResponse: ApiTypes.Link = {
        id: "link1",
        name: payload.name,
        url: payload.url,
        collectionId,
        folderId: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        isLink: true,
      };
      mockDoFetch.mockResolvedValueOnce(mockResponse);

      const result = await handler.createLink(payload);

      expect(mockDoFetch).toHaveBeenCalledWith(
        `collections/${collectionId}/links`,
        apiKey,
        {
          method: "POST",
          body: JSON.stringify(payload),
        }
      );
      expect(result).toEqual({ data: mockResponse, error: null });
    });

    it("should call doFetch with correct parameters with folderId", async () => {
      const folderId = "folder-123";
      const payload: ApiTypes.LinkCreateRequest = {
        name: "Test Link",
        url: "https://example.com",
        folderId,
      };
      const mockResponse: ApiTypes.Link = {
        id: "link1",
        name: payload.name,
        url: payload.url,
        collectionId,
        folderId,
        createdAt: new Date(),
        updatedAt: new Date(),
        isLink: true,
      };
      mockDoFetch.mockResolvedValueOnce(mockResponse);

      const result = await handler.createLink(payload);

      expect(mockDoFetch).toHaveBeenCalledWith(
        `collections/${collectionId}/links`,
        apiKey,
        {
          method: "POST",
          body: JSON.stringify(payload),
        }
      );
      expect(result).toEqual({ data: mockResponse, error: null });
    });

    it("should return an error if doFetch fails", async () => {
      const payload: ApiTypes.LinkCreateRequest = {
        name: "Test Link",
        url: "https://example.com",
      };
      const mockError = new Error("Create Link Error");
      mockDoFetch.mockRejectedValueOnce(mockError);

      const result = await handler.createLink(payload);
      expect(result).toEqual({ data: null, error: mockError });
    });
  });

  describe("deleteLink", () => {
    it("should call doFetch with correct parameters", async () => {
      const linkId = "link-123";
      mockDoFetch.mockResolvedValueOnce(undefined);

      const result = await handler.deleteLink(linkId);

      expect(mockDoFetch).toHaveBeenCalledWith(
        `collections/${collectionId}/links/${linkId}`,
        apiKey,
        {
          method: "DELETE",
        }
      );
      expect(result).toEqual({ data: undefined, error: null });
    });

    it("should return an error if doFetch fails", async () => {
      const linkId = "link-123";
      const mockError = new Error("Delete Link Error");
      mockDoFetch.mockRejectedValueOnce(mockError);

      const result = await handler.deleteLink(linkId);
      expect(result).toEqual({ data: null, error: mockError });
    });
  });

  describe("link", () => {
    it("should call linksHandler with correct parameters", () => {
      const linkId = "link-123";
      const mockHandlerInstance = { delete: jest.fn() };
      mockLinksHandler.mockReturnValueOnce(mockHandlerInstance);

      const result = handler.link(linkId);

      expect(mockLinksHandler).toHaveBeenCalledWith(
        collectionId,
        linkId,
        apiKey
      );
      expect(result).toBe(mockHandlerInstance);
    });
  });
});
