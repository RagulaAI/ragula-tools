import { tool } from "ai";
import { z } from "zod";
import Ragula from "@ragula/sdk";
import { QueryResultItem } from "@ragula/sdk/dist/types";

/**
 * Creates a tool that fetches relevant context from a Ragular knowledge base
 */
export const ragularTool = (apiKey: string, collectionId: string) =>
  tool({
    description:
      "Fetch additional context from the knowledgebase for the provided search query.",
    parameters: z.object({
      query: z
        .string()
        .describe("A string to find more information in the knowledgebase"),
    }),
    execute: async ({ query }: { query: string }) => {
      const ragula = new Ragula(apiKey);
      const collectionHandler = ragula.collection(collectionId);

      const { data, error } = await collectionHandler.query(query);

      if (error) {
        throw new Error(`Error fetching context: ${error.message}`);
      }

      if (!data) {
        throw new Error("No data returned from the query.");
      }

      if (!data.results) {
        throw new Error("No results found in the query response.");
      }

      return {
        context: data.results.reduce((acc: string, result: QueryResultItem) => {
          if (result?.contentSnippet) {
            return `${acc}\n\n${result.contentSnippet}`;
          }
          return acc;
        }, ""),
      };
    },
  });
