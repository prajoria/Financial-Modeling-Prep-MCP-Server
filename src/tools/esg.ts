import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { ESGClient } from "../api/esg/ESGClient.js";

/**
 * Register all ESG-related tools with the MCP server
 * @param server The MCP server instance
 * @param accessToken The Financial Modeling Prep API access token
 */
export function registerESGTools(server: McpServer, accessToken: string): void {
  const esgClient = new ESGClient(accessToken);

  server.tool(
    "getESGDisclosures",
    {
      symbol: z.string().describe("Stock symbol"),
      limit: z
        .number()
        .optional()
        .describe("Optional limit on number of results"),
    },
    async ({ symbol, limit }) => {
      try {
        const results = await esgClient.getDisclosures(symbol, limit);
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
    "getESGRatings",
    {
      symbol: z.string().describe("Stock symbol"),
    },
    async ({ symbol }) => {
      try {
        const results = await esgClient.getRatings(symbol);
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
    "getESGBenchmarks",
    {
      sector: z.string().describe("Sector to get benchmarks for"),
      year: z
        .string()
        .optional()
        .describe("Optional year to get benchmarks for"),
    },
    async ({ sector, year }) => {
      try {
        const results = await esgClient.getBenchmarks(sector, year);
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
}
