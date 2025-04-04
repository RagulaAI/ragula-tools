import filesHandler from "../handlers/filesHandler";
import { doFetch } from "../utils/api";
import { tryCatch } from "../utils/tryCatch";

// Mock the dependencies
jest.mock("../utils/api");
jest.mock("../utils/tryCatch", () => ({
  tryCatch: jest.fn((fn) =>
    fn
      .then((data: any) => ({ data, error: null }))
      .catch((error: any) => ({ data: null, error }))
  ),
}));

const mockDoFetch = doFetch as jest.Mock;

describe("Files Handler", () => {
  const apiKey = "test-api-key";
  const collectionId = "col-123";
  const fileId = "file-456";
  let handler: ReturnType<typeof filesHandler>;

  beforeEach(() => {
    mockDoFetch.mockClear();
    (tryCatch as jest.Mock).mockClear();
    handler = filesHandler(collectionId, fileId, apiKey);
  });

  describe("delete", () => {
    it("should call doFetch with correct parameters", async () => {
      mockDoFetch.mockResolvedValueOnce(undefined);

      await handler.delete();

      expect(mockDoFetch).toHaveBeenCalledWith(
        `collections/${collectionId}/files/${fileId}`,
        apiKey,
        { method: "DELETE" }
      );
    });

    it("should throw an error if doFetch fails", async () => {
      const mockError = new Error("Delete Error");
      mockDoFetch.mockRejectedValueOnce(mockError);

      await expect(handler.delete()).rejects.toThrow(mockError);
    });
  });
});
