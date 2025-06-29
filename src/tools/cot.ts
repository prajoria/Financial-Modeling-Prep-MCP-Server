import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { COTClient } from "../api/cot/COTClient.js";

/**
 * Register all COT-related tools with the MCP server
 * @param server The MCP server instance
 * @param accessToken The Financial Modeling Prep API access token (optional when using lazy loading)
 */
export function registerCOTTools(server: McpServer, accessToken?: string): void {
  const cotClient = new COTClient(accessToken);

  server.tool(
    "getCOTReports",
    {
      symbol: z.string().describe("Commodity symbol"),
      from: z
        .string()
        .optional()
        .describe("Optional start date (YYYY-MM-DD)"),
      to: z
        .string()
        .optional()
        .describe("Optional end date (YYYY-MM-DD)"),
    },
    async ({ symbol, from, to }) => {
      try {
        const results = await cotClient.getReports(symbol, from, to);
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
      from: z
        .string()
        .optional()
        .describe("Optional start date (YYYY-MM-DD)"),
      to: z
        .string()
        .optional()
        .describe("Optional end date (YYYY-MM-DD)"),
    },
    async ({ symbol, from, to }) => {
      try {
        const results = await cotClient.getAnalysis(symbol, from, to);
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
