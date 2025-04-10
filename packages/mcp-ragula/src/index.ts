#!/usr/bin/env node

process.on("uncaughtException", (error) => {
  console.error("!!! MCP Uncaught Exception:", error);
  process.exit(1);
});

process.on("unhandledRejection", (reason) => {
  console.error("!!! MCP Unhandled Rejection:", reason);
});

import {
  McpServer,
  ResourceTemplate,
} from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { Ragula } from "@ragula/sdk";
import { z } from "zod";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import fs from "fs/promises";
import path from "path";

// Helper function to handle try/catch blocks
const tryCatch = async <T>(promise: () => Promise<T>) => {
  try {
    const data = await promise();
    return { data, error: null };
  } catch (error) {
    return { data: null, error };
  }
};
// Helper to handle SDK's {data, error} return structure
const executeRagulaAction = async <T>(
  action: () => Promise<{ data: T | null; error: Error | null }>
) => {
  const result = await action();

  if (result.error) {
    const errorMessage =
      result.error instanceof Error
        ? result.error.message
        : String(result.error);

    console.error("Ragula SDK Error:", errorMessage);

    return {
      content: [{ type: "text" as const, text: `Error: ${errorMessage}` }],
      isError: true,
    };
  }

  if (result.data !== null && result.data !== undefined) {
    return {
      content: [
        { type: "text" as const, text: JSON.stringify(result.data, null, 2) },
      ],
    };
  }

  return {
    content: [
      {
        type: "text" as const,
        text: "Error: Unexpected null response from SDK",
      },
    ],
    isError: true,
  };
};

(async () => {
  const args = await yargs(hideBin(process.argv))
    .option("api-key", {
      alias: "k",
      type: "string",
      description: "Ragula API Key",
      demandOption: true,
    })
    .help()
    .alias("help", "h")
    .parseAsync();

  const apiKey = args.apiKey;
  // Initialize the Ragula client
  const ragulaClient = new Ragula(apiKey);

  const server = new McpServer({
    name: "ragula-mcp",
    version: "0.1.0",
    capabilities: {
      tools: {},
      resources: {},
    },
  });

  // --- Define MCP Tools (Mapping Ragula SDK methods) ---

  // == Collection Tools ==

  // Define a basic Collection type (adjust if SDK provides a specific type)
  interface Collection {
    id: string;
    name: string;
    // Add other relevant fields if known/needed
  }

  // Cache variables now store raw Collection data
  let collectionsCache: Collection[] | null = null;
  let cacheTimestamp: number | null = null;
  const CACHE_DURATION_MS = 5 * 60 * 1000; // 5 minutes

  // Function to get cached or fresh collections data
  async function getCachedCollections(): Promise<{
    data: Collection[] | null;
    error: Error | null;
  }> {
    const now = Date.now();
    if (
      collectionsCache &&
      cacheTimestamp &&
      now - cacheTimestamp < CACHE_DURATION_MS
    ) {
      return { data: collectionsCache, error: null };
    }

    const { data, error } = await ragulaClient.listCollections();

    if (error) {
      collectionsCache = null;
      cacheTimestamp = null;
      return { data: null, error };
    }

    if (!data) {
      collectionsCache = null;
      cacheTimestamp = null;
      return { data: [], error: null };
    }

    if (
      Array.isArray(data) &&
      data.every((item) => typeof item?.id === "string")
    ) {
      collectionsCache = data as Collection[];
      cacheTimestamp = now;
      return { data: collectionsCache, error: null };
    }

    collectionsCache = null;
    cacheTimestamp = null;
    return {
      data: null,
      error: new Error("Invalid data format received from listCollections"),
    };
  }
  server.tool("listCollections", {}, async () => {
    const { data, error } = await getCachedCollections();

    if (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      return {
        content: [{ type: "text", text: `Error: ${errorMessage}` }],
        isError: true,
      };
    }

    return {
      content: [{ type: "text", text: JSON.stringify(data ?? [], null, 2) }],
    };
  });

  server.tool(
    "createCollection",
    { name: z.string().describe("The name for the new collection") },
    async ({ name }) =>
      executeRagulaAction(() => ragulaClient.createCollection(name, null)) // Assuming null description for now
  );

  server.tool(
    "getCollectionDetails",
    { collectionId: z.string().describe("The ID of the collection") },
    async ({ collectionId }) =>
      executeRagulaAction(() => ragulaClient.collection(collectionId).details())
  );

  server.tool(
    "getCollectionStatus",
    { collectionId: z.string().describe("The ID of the collection") },
    async ({ collectionId }) =>
      executeRagulaAction(() => ragulaClient.collection(collectionId).status())
  );

  server.tool(
    "updateCollection",
    {
      collectionId: z.string().describe("The ID of the collection to update"),
      name: z.string().describe("The new name for the collection"),
      // Add description if needed: description: z.string().optional().describe("Optional new description")
    },
    async ({ collectionId, name }) =>
      executeRagulaAction(() =>
        ragulaClient.collection(collectionId).update({ name })
      )
  );

  server.tool(
    "deleteCollection",
    { collectionId: z.string().describe("The ID of the collection to delete") },
    async ({ collectionId }) =>
      executeRagulaAction(() => ragulaClient.collection(collectionId).delete())
  );

  // == Folder Tools ==
  server.tool(
    "listFolders",
    { collectionId: z.string().describe("The ID of the collection") },
    async ({ collectionId }) =>
      executeRagulaAction(() =>
        ragulaClient.collection(collectionId).listFolders()
      )
  );

  server.tool(
    "createFolder",
    {
      collectionId: z.string().describe("The ID of the collection"),
      name: z.string().describe("The name of the new folder"),
      parentId: z
        .string()
        .optional()
        .describe(
          "Optional ID of the parent folder (creates in root if omitted)"
        ), // Make parentId optional
    },
    async ({ collectionId, name, parentId }) => {
      const payload = { name, parentId: parentId || null }; // Ensure parentId is string or null
      return executeRagulaAction(() =>
        ragulaClient.collection(collectionId).createFolder(payload)
      );
    }
  );

  server.tool(
    "deleteFolder",
    {
      collectionId: z.string().describe("The ID of the collection"),
      folderId: z.string().describe("The ID of the folder to delete"),
    },
    async ({ collectionId, folderId }) =>
      executeRagulaAction(() =>
        ragulaClient.collection(collectionId).folder(folderId).delete()
      )
  );

  server.tool(
    "listFolderFiles",
    {
      collectionId: z.string().describe("The ID of the collection"),
      folderId: z.string().describe("The ID of the folder"),
    },
    async ({ collectionId, folderId }) =>
      executeRagulaAction(() =>
        ragulaClient.collection(collectionId).folder(folderId).listFiles()
      )
  );

  // == File Tools ==
  server.tool(
    "listCollectionFiles",
    { collectionId: z.string().describe("The ID of the collection") },
    async ({ collectionId }) =>
      executeRagulaAction(() =>
        ragulaClient.collection(collectionId).listFiles()
      ) // Lists all files recursively
  );

  server.tool(
    "uploadFile",
    {
      collectionId: z.string().describe("The ID of the collection"),
      filePath: z.string().describe("The local path to the file to upload"),
      folderId: z
        .string()
        .optional()
        .describe("Optional ID of the folder to upload into"),
    },
    async ({ collectionId, filePath, folderId }) => {
      const { data: fileContent, error: accessError } = await tryCatch(
        async () => {
          await fs.access(filePath, fs.constants.R_OK);
          return fs.readFile(filePath);
        }
      );

      if (accessError) {
        const errorMessage =
          accessError instanceof Error
            ? accessError.message
            : String(accessError);
        return {
          content: [
            { type: "text", text: `File system error: ${errorMessage}` },
          ],
          isError: true,
        };
      }

      if (!fileContent) {
        return {
          content: [
            {
              type: "text",
              text: "File content is empty or could not be read",
            },
          ],
          isError: true,
        };
      }

      const filename = path.basename(filePath);
      const fileToUpload = new File([fileContent], filename);

      return executeRagulaAction(() =>
        ragulaClient.collection(collectionId).uploadFile(fileToUpload)
      );
    }
  );

  server.tool(
    "deleteFile",
    {
      collectionId: z.string().describe("The ID of the collection"),
      fileId: z
        .string()
        .describe("The ID of the file to delete (in root or any folder)"),
      // folderId: z.string().optional().describe("Optional: Specify folder ID if known, otherwise searches collection"), // SDK might not support this distinction easily
    },
    async ({ collectionId, fileId }) =>
      executeRagulaAction(() =>
        ragulaClient.collection(collectionId).file(fileId).delete()
      )
  );

  // == Querying Tools ==
  server.tool(
    "query",
    {
      collectionId: z.string().describe("The ID of the collection to query"),
      queryText: z.string().describe("The semantic query text"),
    },
    async ({ collectionId, queryText }) =>
      executeRagulaAction(() =>
        ragulaClient.collection(collectionId).query(queryText)
      )
  );

  server.tool(
    "question",
    {
      collectionId: z.string().describe("The ID of the collection to ask"),
      questionText: z.string().describe("The question text (RAG)"),
    },
    async ({ collectionId, questionText }) =>
      await executeRagulaAction(() =>
        ragulaClient.collection(collectionId).question(questionText)
      )
  );

  // --- Define MCP Resources ---

  server.resource(
    "collection",
    new ResourceTemplate("ragula://collection/{collectionId}", {
      list: async () => {
        const { data: collections, error } = await getCachedCollections();

        if (error || !collections || collections.length === 0) {
          return { resources: [] };
        }

        const resourceList = collections.map((coll) => ({
          uri: `ragula://collection/${coll.id}`,
          name: coll.name || coll.id,
        }));

        return { resources: resourceList };
      },
    }),
    async (uri, { collectionId }) => {
      const id = Array.isArray(collectionId) ? collectionId[0] : collectionId;

      if (typeof id !== "string" || !id) {
        throw new Error(`Invalid or missing collectionId in URI: ${uri.href}`);
      }

      const result = await executeRagulaAction(() =>
        ragulaClient.collection(id).details()
      );

      if ("isError" in result && result.isError) {
        throw new Error(
          `Failed to fetch resource ${uri.href}: ${result.content[0].text}`
        );
      }

      return {
        contents: [
          {
            uri: uri.href,
            text: result.content[0].text,
          },
        ],
      };
    }
  );

  const transport = new StdioServerTransport();
  await server.connect(transport);
})();
// The process will now stay alive listening to stdin via the transport
