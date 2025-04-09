// --- Global Error Handlers ---
// Keep these for general process stability
process.on("uncaughtException", (error) => {
  console.error("!!! MCP Uncaught Exception:", error);
  // Consider logging to stderr for MCP compliance if needed
  process.exit(1);
});

process.on("unhandledRejection", (reason, promise) => {
  console.error("!!! MCP Unhandled Rejection at:", promise, "reason:", reason);
  // Consider logging to stderr
  // process.exit(1); // Optional: exit on unhandled rejections
});
// --- End Global Error Handlers ---

import {
  McpServer,
  ResourceTemplate,
} from "@modelcontextprotocol/sdk/server/mcp.js";
// Import TextContent type from the correct module
import {
  TextContent, // Correct type name
  // ToolResult, ResourceContents are not exported, remove them
} from "@modelcontextprotocol/sdk/types.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
// Revert to default import for Ragula
import Ragula from "@ragula/sdk";
import { z } from "zod";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import fs from "fs/promises"; // Use promises version for async operations
import path from "path";

interface PresetCollection {
  id: string;
  description: string;
}

/**
 * Helper function to handle try/catch blocks and format for MCP tool results
 * @param promise The promise to execute
 * @returns MCP ToolResult structure
 */
// Remove explicit ToolResult return type annotation
const executeRagulaAction = async <T>(
  action: () => Promise<T>
) /* : Promise<ToolResult> */ => {
  // Let TS infer from server.tool usage
  try {
    const data = await action();
    // Format successful data explicitly as TextContentPart array
    // Use TextContent type
    const content: TextContent[] = [
      // Use the correctly imported TextContent type
      { type: "text", text: JSON.stringify(data, null, 2) },
    ];
    return {
      content,
    };
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("Ragula SDK Error:", errorMessage, error);
    // Format error explicitly as TextContentPart array
    // Use TextContent type
    const content: TextContent[] = [
      // Use the correctly imported TextContent type
      { type: "text", text: `Error: ${errorMessage}` },
    ];
    return {
      content,
      isError: true,
    };
  }
};

// --- Argument Parsing ---
const args = await yargs(hideBin(process.argv)) // Use await for potential async parsing in future
  .option("api-key", {
    alias: "k",
    type: "string",
    description: "Ragula API Key",
    demandOption: true,
  })
  .option("preset-collections", {
    alias: "p",
    type: "string",
    description:
      'JSON string of preset collections (e.g., \'[{"id": "coll_abc", "description": "..."}]\')',
    default: "[]", // Default to empty array string
  })
  .help()
  .alias("help", "h")
  .parseAsync(); // Use parseAsync

const apiKey = args.apiKey;
let presetCollections: PresetCollection[] = [];

try {
  const parsed = JSON.parse(args.presetCollections);
  if (Array.isArray(parsed)) {
    presetCollections = parsed.filter(
      (
        pc
      ): pc is PresetCollection => // Type guard
        typeof pc?.id === "string" && typeof pc?.description === "string"
    );
    console.log(`Parsed ${presetCollections.length} preset collections.`);
  } else {
    console.error(
      "Invalid format for preset collections. Expected a JSON array. Using empty list."
    );
  }
} catch (error) {
  console.error(
    "Error parsing preset collections JSON:",
    error,
    "Using empty list."
  );
}

// --- Ragula Client Initialization ---
// Initialize the client once
const ragulaClient = new Ragula(apiKey);
console.log("Ragula Client Initialized.");

// --- MCP Server Setup ---
console.log("Setting up MCP Server...");
const server = new McpServer({
  name: "ragula-mcp", // Choose a suitable name
  version: "0.1.0", // Match package.json version
  // Define capabilities based on implemented tools/resources
  capabilities: {
    tools: {}, // Will be populated by server.tool calls
    resources: {}, // Will be populated by server.resource calls
    // prompts: {} // Add if prompts are implemented
  },
});

console.log("MCP Server instance created.");

// --- Define MCP Tools (Mapping Ragula SDK methods) ---

// == Collection Tools ==
server.tool(
  "ragula:listCollections",
  {}, // No input arguments
  async () => executeRagulaAction(() => ragulaClient.listCollections())
);

server.tool(
  "ragula:createCollection",
  { name: z.string().describe("The name for the new collection") },
  async ({ name }) =>
    executeRagulaAction(() => ragulaClient.createCollection(name, null)) // Assuming null description for now
);

server.tool(
  "ragula:getCollectionDetails",
  { collectionId: z.string().describe("The ID of the collection") },
  async ({ collectionId }) =>
    executeRagulaAction(() => ragulaClient.collection(collectionId).details())
);

server.tool(
  "ragula:getCollectionStatus",
  { collectionId: z.string().describe("The ID of the collection") },
  async ({ collectionId }) =>
    executeRagulaAction(() => ragulaClient.collection(collectionId).status())
);

server.tool(
  "ragula:updateCollection",
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
  "ragula:deleteCollection",
  { collectionId: z.string().describe("The ID of the collection to delete") },
  async ({ collectionId }) =>
    executeRagulaAction(() => ragulaClient.collection(collectionId).delete())
);

// == Folder Tools ==
server.tool(
  "ragula:listFolders",
  { collectionId: z.string().describe("The ID of the collection") },
  async ({ collectionId }) =>
    executeRagulaAction(() =>
      ragulaClient.collection(collectionId).listFolders()
    )
);

server.tool(
  "ragula:createFolder",
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
    const payload = { name, ...(parentId && { parentId }) }; // Conditionally add parentId
    return executeRagulaAction(() =>
      ragulaClient.collection(collectionId).createFolder(payload)
    );
  }
);

server.tool(
  "ragula:deleteFolder",
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
  "ragula:listFolderFiles",
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
  "ragula:listCollectionFiles",
  { collectionId: z.string().describe("The ID of the collection") },
  async ({ collectionId }) =>
    executeRagulaAction(() => ragulaClient.collection(collectionId).listFiles()) // Lists all files recursively
);

server.tool(
  "ragula:uploadFile",
  {
    collectionId: z.string().describe("The ID of the collection"),
    filePath: z.string().describe("The local path to the file to upload"),
    folderId: z
      .string()
      .optional()
      .describe("Optional ID of the folder to upload into"),
  },
  async ({ collectionId, filePath, folderId }) => {
    try {
      // Check file existence asynchronously
      await fs.access(filePath, fs.constants.R_OK); // Check read access
      const fileContent = await fs.readFile(filePath);
      const filename = path.basename(filePath);

      const uploadPayload: {
        content: Buffer;
        filename: string;
        folderId?: string;
      } = {
        content: fileContent,
        filename,
        ...(folderId && { folderId }),
      };

      // Need to check the expected type for ragulaClient.uploadFile
      // Assuming it takes an object like this, but might need adjustment
      // The 'as any' might still be needed if the SDK types don't align perfectly
      // or if the SDK expects FormData/Blob which isn't directly created here.
      return await executeRagulaAction(() =>
        ragulaClient.collection(collectionId).uploadFile(uploadPayload as any)
      );
    } catch (error: unknown) {
      // Handle file system errors (e.g., not found, permissions)
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      console.error("File Upload Error:", errorMessage, error);
      return {
        content: [{ type: "text", text: `File system error: ${errorMessage}` }],
        isError: true,
      };
    }
  }
);

server.tool(
  "ragula:deleteFile",
  {
    collectionId: z.string().describe("The ID of the collection"),
    fileId: z
      .string()
      .describe("The ID of the file to delete (in root or any folder)"),
    // folderId: z.string().optional().describe("Optional: Specify folder ID if known, otherwise searches collection"), // SDK might not support this distinction easily
  },
  // The Ragula SDK delete seems to operate on the collection level with fileId
  async ({ collectionId, fileId }) =>
    executeRagulaAction(() =>
      ragulaClient.collection(collectionId).file(fileId).delete()
    )
);

// Note: deleteFolderFile might be redundant if deleteFile works globally.
// If the SDK requires specifying the folder for deletion, add it back.
// server.tool(
//   "ragula:deleteFolderFile",
// ... implementation ...
// );

// == Querying Tools ==
server.tool(
  "ragula:query",
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
  "ragula:question",
  {
    collectionId: z.string().describe("The ID of the collection to ask"),
    questionText: z.string().describe("The question text (RAG)"),
  },
  async ({ collectionId, questionText }) =>
    executeRagulaAction(() =>
      ragulaClient.collection(collectionId).question(questionText)
    )
);

// --- Define MCP Resources ---

// Example: Resource for listing preset collections
server.resource(
  "ragula:presetCollections", // Resource name
  "ragula://presets", // Static URI for this resource
  async (uri) /* : Promise<ResourceContents> */ => ({
    // Remove explicit return type annotation
    // Add explicit return type
    contents: [
      {
        uri: uri.href,
        text: JSON.stringify(presetCollections, null, 2),
      },
    ],
  })
);

// Example: Resource for getting collection details (dynamic URI)
server.resource(
  "ragula:collection", // Resource name
  new ResourceTemplate("ragula://collection/{collectionId}", {
    list: undefined,
  }), // Template URI
  async (uri, { collectionId }) /* : Promise<ResourceContents> */ => {
    // Remove explicit return type annotation
    // Add explicit return type
    const result = await executeRagulaAction(() =>
      ragulaClient.collection(collectionId).details()
    );
    if (result.isError) {
      // Throwing an error is appropriate for resource failures
      throw new Error(
        `Failed to fetch resource ${uri.href}: ${result.content[0].text}`
      );
    }
    // Ensure the structure matches ResourceContents
    return {
      contents: [
        {
          uri: uri.href,
          text: result.content[0].text, // Already a string from executeRagulaAction
        },
      ],
    };
  }
);

console.log("MCP Tools and Resources defined.");

// --- Start Server ---
console.log("Connecting MCP Server via Stdio...");
const transport = new StdioServerTransport();
await server.connect(transport);

console.log("MCP Server is running and connected via stdio.");
// The process will now stay alive listening to stdin via the transport
