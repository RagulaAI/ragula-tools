import { tool } from "@langchain/core/tools";
import { z } from "zod";
import Ragula, { QueryResultItem } from "@ragula/sdk";

export const ragularTool = (apiKey: string, collectionId: string) =>
  tool(async ({ query }: { query: string }): Promise<string> => {
    try {
      const ragula = new Ragula(apiKey);
      const collectionHandler = ragula.collection(collectionId);
      const { data, error } = await collectionHandler.query(query);

      if (error) {
        // Langchain tools generally expect a string return, even on error,
        // to allow the chain to potentially handle it or report it.
        return `Error fetching context from Ragula: ${error.message}`;
      }

      if (!data) {
        return "No data object returned from the knowledge base query.";
      }

      if (!data.results || data.results.length === 0) {
        return "No relevant context found in the knowledge base for the query.";
      }

      // Concatenate content snippets into a single string as required by Langchain tools
      const context = data.results.reduce(
        (acc: string, result: QueryResultItem) => {
          if (result?.contentSnippet) {
            // Add a separator for clarity between snippets
            return acc
              ? `${acc}\n\n---\n\n${result.contentSnippet}`
              : result.contentSnippet;
          }
          return acc;
        },
        ""
      );

      // Return empty string if reduction resulted in nothing (e.g., all snippets were null/empty)
      return context || "No content snippets found in the results.";

    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      return `An unexpected error occurred during Ragula tool execution: ${message}`;
    }
  },{
    name: "ragula-knowledge-base-retriever",
    description:
      "Fetch additional context from the knowledgebase for the provided search query. Use this when you need specific information or context related to a topic.",
    schema: z.object({
      query: z
        .string()
        .describe(
          "The specific question or topic to search for in the knowledge base to retrieve relevant context."
        ),
    })
  });
