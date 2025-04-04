import { FilesService } from "../src/services/FilesService";
import { request as __request } from "../src/core/request";
import { OpenAPI } from "../src/core/OpenAPI";
import { ApiError } from "../src/core/ApiError";

jest.mock("../src/core/request", () => ({
  request: jest.fn(),
}));

const mockRequest = __request as jest.Mock;

type File = {
  id: string;
  name: string;
  type: string;
  size: number;
  collectionId: string;
  folderId: string | null;
  createdAt: string;
  updatedAt: string;
  storagePath: string;
};

describe("FilesService", () => {
  beforeEach(() => {
    mockRequest.mockClear();
  });

  const collectionId = "test-coll-id";
  const folderId = "test-folder-id";
  const fileId = "test-file-id";
  const sampleFile: File = {
    id: fileId,
    name: "test.txt",
    type: "text/plain",
    size: 123,
    collectionId: collectionId,
    folderId: folderId,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    storagePath: "path/to/storage/test.txt",
  };
  const sampleFileList: File[] = [sampleFile];
  const apiError = new Error("API Error");

  describe("getApiCollectionsFiles", () => {
    it("should list files in a collection successfully", async () => {
      mockRequest.mockResolvedValue(sampleFileList);

      const resultPromise = FilesService.getApiCollectionsFiles(collectionId);
      await expect(resultPromise).resolves.toEqual(sampleFileList);

      expect(mockRequest).toHaveBeenCalledTimes(1);
      expect(mockRequest).toHaveBeenCalledWith(OpenAPI, {
        method: "GET",
        url: "/api/collections/{collectionId}/files",
        path: { collectionId },
        query: { folderId: undefined }, // Ensure folderId is undefined when not passed
        errors: { 401: `Unauthorized`, 404: `Collection or Folder Not Found` },
      });
    });

    it("should list files in a specific folder successfully", async () => {
      mockRequest.mockResolvedValue(sampleFileList);

      const resultPromise = FilesService.getApiCollectionsFiles(
        collectionId,
        folderId
      );
      await expect(resultPromise).resolves.toEqual(sampleFileList);

      expect(mockRequest).toHaveBeenCalledTimes(1);
      expect(mockRequest).toHaveBeenCalledWith(OpenAPI, {
        method: "GET",
        url: "/api/collections/{collectionId}/files",
        path: { collectionId },
        query: { folderId: folderId }, // Ensure folderId is passed
        errors: { 401: `Unauthorized`, 404: `Collection or Folder Not Found` },
      });
    });

    it("should handle errors when listing files", async () => {
      mockRequest.mockRejectedValue(apiError);

      const resultPromise = FilesService.getApiCollectionsFiles(collectionId);
      await expect(resultPromise).rejects.toThrow(apiError);
      expect(mockRequest).toHaveBeenCalledTimes(1);
    });
  });

  describe("postApiCollectionsFiles", () => {
    const mockBlob = new Blob(["file content"], { type: "text/plain" });
    const formData = {
      file: mockBlob,
      folderId: folderId,
    };

    it("should upload a file successfully", async () => {
      mockRequest.mockResolvedValue(sampleFile);

      const resultPromise = FilesService.postApiCollectionsFiles(
        collectionId,
        formData
      );
      await expect(resultPromise).resolves.toEqual(sampleFile);

      expect(mockRequest).toHaveBeenCalledTimes(1);
      expect(mockRequest).toHaveBeenCalledWith(OpenAPI, {
        method: "POST",
        url: "/api/collections/{collectionId}/files",
        path: { collectionId },
        formData: formData,
        mediaType: "multipart/form-data",
        errors: {
          400: `Bad Request / Missing file`,
          401: `Unauthorized`,
          404: `Collection or Folder Not Found`,
          413: `Payload Too Large`,
        },
      });
    });

    it("should upload a file without folderId successfully", async () => {
      const formDataWithoutFolder = { file: mockBlob };
      const sampleFileWithoutFolder = { ...sampleFile, folderId: null };
      mockRequest.mockResolvedValue(sampleFileWithoutFolder);

      const resultPromise = FilesService.postApiCollectionsFiles(
        collectionId,
        formDataWithoutFolder
      );
      await expect(resultPromise).resolves.toEqual(sampleFileWithoutFolder);

      expect(mockRequest).toHaveBeenCalledTimes(1);
      expect(mockRequest).toHaveBeenCalledWith(OpenAPI, {
        method: "POST",
        url: "/api/collections/{collectionId}/files",
        path: { collectionId },
        formData: formDataWithoutFolder,
        mediaType: "multipart/form-data",
        errors: {
          400: `Bad Request / Missing file`,
          401: `Unauthorized`,
          404: `Collection or Folder Not Found`,
          413: `Payload Too Large`,
        },
      });
    });

    it("should handle errors when uploading a file", async () => {
      mockRequest.mockRejectedValue(apiError);

      const resultPromise = FilesService.postApiCollectionsFiles(
        collectionId,
        formData
      );
      await expect(resultPromise).rejects.toThrow(apiError);
      expect(mockRequest).toHaveBeenCalledTimes(1);
    });
  });

  describe("deleteApiCollectionsFiles", () => {
    it("should delete a file successfully", async () => {
      mockRequest.mockResolvedValue(undefined);

      const resultPromise = FilesService.deleteApiCollectionsFiles(
        collectionId,
        fileId
      );
      await expect(resultPromise).resolves.toBeUndefined();

      expect(mockRequest).toHaveBeenCalledTimes(1);
      expect(mockRequest).toHaveBeenCalledWith(OpenAPI, {
        method: "DELETE",
        url: "/api/collections/{collectionId}/files/{fileId}",
        path: { collectionId, fileId },
        errors: { 401: `Unauthorized`, 404: `Not Found` },
      });
    });

    it("should handle errors when deleting a file", async () => {
      mockRequest.mockRejectedValue(apiError);

      const resultPromise = FilesService.deleteApiCollectionsFiles(
        collectionId,
        fileId
      );
      await expect(resultPromise).rejects.toThrow(apiError);
      expect(mockRequest).toHaveBeenCalledTimes(1);
    });
  });
});
