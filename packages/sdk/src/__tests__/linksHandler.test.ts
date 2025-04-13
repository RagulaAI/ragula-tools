import linksHandler from "../handlers/linksHandler";
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

describe("Links Handler", () => {
  const apiKey = "test-api-key";
  const collectionId = "col-123";
  const linkId = "link-456";
  let handler: ReturnType<typeof linksHandler>;

  beforeEach(() => {
    mockDoFetch.mockClear();
    (tryCatch as jest.Mock).mockClear();
    handler = linksHandler(collectionId, linkId, apiKey);
  });

  describe("delete", () => {
    it("should call doFetch with correct parameters", async () => {
      mockDoFetch.mockResolvedValueOnce(undefined);

      const result = await handler.delete();
      // Assuming successful delete resolves with undefined data via tryCatch
      expect(result).toEqual({ data: undefined, error: null });

      expect(mockDoFetch).toHaveBeenCalledWith(
        `collections/${collectionId}/links/${linkId}`,
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
});
