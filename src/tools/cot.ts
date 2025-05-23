import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { COTClient } from "../api/cot/COTClient.js";

/**
 * Register all COT-related tools with the MCP server
 * @param server The MCP server instance
 * @param accessToken The Financial Modeling Prep API access token
 */
export function registerCOTTools(server: McpServer, accessToken: string): void {
  const cotClient = new COTClient(accessToken);

  server.tool(
    "getCOTReports",
    {
      symbol: z.string().describe("Commodity symbol"),
      limit: z
        .number()
        .optional()
        .describe("Optional limit on number of results"),
    },
    async ({ symbol, limit }) => {
      try {
        const results = await cotClient.getReports(symbol, limit);
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
    "getCOTAnalysis",
    {
      symbol: z.string().describe("Commodity symbol"),
      limit: z
        .number()
        .optional()
        .describe("Optional limit on number of results"),
    },
    async ({ symbol, limit }) => {
      try {
        const results = await cotClient.getAnalysis(symbol, limit);
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

  server.tool("getCOTList", {}, async () => {
    try {
      const results = await cotClient.getList();
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
