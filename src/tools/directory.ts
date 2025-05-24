import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { DirectoryClient } from "../api/directory/DirectoryClient.js";

/**
 * Register all directory-related tools with the MCP server
 * @param server The MCP server instance
 * @param accessToken The Financial Modeling Prep API access token (optional when using lazy loading)
 */
export function registerDirectoryTools(
  server: McpServer,
  accessToken?: string
): void {
  const directoryClient = new DirectoryClient(accessToken);

  server.tool("getCompanySymbols", {}, async () => {
    try {
      const results = await directoryClient.getCompanySymbols();
      return {
        content: [{ type: "text", text: JSON.stringify(results, null, 2) }],
      };
    } catch (error) {
      return {
        content: [
          {
            type: "text",
            text: `Error: ${
              error instanceof Error ? error.message : String(error)
            }`,
          },
        ],
        isError: true,
      };
    }
  });

  server.tool("getFinancialStatementSymbols", {}, async () => {
    try {
      const results = await directoryClient.getFinancialStatementSymbols();
      return {
        content: [{ type: "text", text: JSON.stringify(results, null, 2) }],
      };
    } catch (error) {
      return {
        content: [
          {
            type: "text",
            text: `Error: ${
              error instanceof Error ? error.message : String(error)
            }`,
          },
        ],
        isError: true,
      };
    }
  });

  server.tool(
    "getCIKList",
    {
      limit: z
        .number()
        .optional()
        .describe("Optional limit on number of results (default: 1000)"),
    },
    async ({ limit }) => {
      try {
        const results = await directoryClient.getCIKList(limit);
        return {
          content: [{ type: "text", text: JSON.stringify(results, null, 2) }],
        };
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: `Error: ${
                error instanceof Error ? error.message : String(error)
              }`,
            },
          ],
          isError: true,
        };
      }
    }
  );

  server.tool(
    "getSymbolChanges",
    {
      invalid: z
        .boolean()
        .optional()
        .describe("Optional filter for invalid symbols (default: false)"),
      limit: z
        .number()
        .optional()
        .describe("Optional limit on number of results (default: 100)"),
    },
    async ({ invalid, limit }) => {
      try {
        const results = await directoryClient.getSymbolChanges(invalid, limit);
        return {
          content: [{ type: "text", text: JSON.stringify(results, null, 2) }],
        };
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: `Error: ${
                error instanceof Error ? error.message : String(error)
              }`,
            },
          ],
          isError: true,
        };
      }
    }
  );

  server.tool("getETFList", {}, async () => {
    try {
      const results = await directoryClient.getETFList();
      return {
        content: [{ type: "text", text: JSON.stringify(results, null, 2) }],
      };
    } catch (error) {
      return {
        content: [
          {
            type: "text",
            text: `Error: ${
              error instanceof Error ? error.message : String(error)
            }`,
          },
        ],
        isError: true,
      };
    }
  });

  server.tool("getActivelyTradingList", {}, async () => {
    try {
      const results = await directoryClient.getActivelyTradingList();
      return {
        content: [{ type: "text", text: JSON.stringify(results, null, 2) }],
      };
    } catch (error) {
      return {
        content: [
          {
            type: "text",
            text: `Error: ${
              error instanceof Error ? error.message : String(error)
            }`,
          },
        ],
        isError: true,
      };
    }
  });

  server.tool("getEarningsTranscriptList", {}, async () => {
    try {
      const results = await directoryClient.getEarningsTranscriptList();
      return {
        content: [{ type: "text", text: JSON.stringify(results, null, 2) }],
      };
    } catch (error) {
      return {
        content: [
          {
            type: "text",
            text: `Error: ${
              error instanceof Error ? error.message : String(error)
            }`,
          },
        ],
        isError: true,
      };
    }
  });

  server.tool("getAvailableExchanges", {}, async () => {
    try {
      const results = await directoryClient.getAvailableExchanges();
      return {
        content: [{ type: "text", text: JSON.stringify(results, null, 2) }],
      };
    } catch (error) {
      return {
        content: [
          {
            type: "text",
            text: `Error: ${
              error instanceof Error ? error.message : String(error)
            }`,
          },
        ],
        isError: true,
      };
    }
  });

  server.tool("getAvailableSectors", {}, async () => {
    try {
      const results = await directoryClient.getAvailableSectors();
      return {
        content: [{ type: "text", text: JSON.stringify(results, null, 2) }],
      };
    } catch (error) {
      return {
        content: [
          {
            type: "text",
            text: `Error: ${
              error instanceof Error ? error.message : String(error)
            }`,
          },
        ],
        isError: true,
      };
    }
  });

  server.tool("getAvailableIndustries", {}, async () => {
    try {
      const results = await directoryClient.getAvailableIndustries();
      return {
        content: [{ type: "text", text: JSON.stringify(results, null, 2) }],
      };
    } catch (error) {
      return {
        content: [
          {
            type: "text",
            text: `Error: ${
              error instanceof Error ? error.message : String(error)
            }`,
          },
        ],
        isError: true,
      };
    }
  });

  server.tool("getAvailableCountries", {}, async () => {
    try {
      const results = await directoryClient.getAvailableCountries();
      return {
        content: [{ type: "text", text: JSON.stringify(results, null, 2) }],
      };
    } catch (error) {
      return {
        content: [
          {
            type: "text",
            text: `Error: ${
              error instanceof Error ? error.message : String(error)
            }`,
          },
        ],
        isError: true,
      };
    }
  });
}
