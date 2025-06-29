import { z } from "zod";
import { EarningsTranscriptClient } from "../api/earnings-transcript/EarningsTranscriptClient.js";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

/**
 * Register all earnings transcript-related tools with the MCP server
 * @param server The MCP server instance
 * @param accessToken The Financial Modeling Prep API access token (optional when using lazy loading)
 */
export function registerEarningsTranscriptTools(
  server: McpServer,
  accessToken?: string
): void {
  const earningsTranscriptClient = new EarningsTranscriptClient(accessToken);

  server.tool(
    "getLatestEarningsTranscripts",
    {
      limit: z.number().optional().describe("Limit the number of results"),
      page: z.number().optional().describe("Page number for pagination"),
    },
    async ({ limit, page }) => {
      try {
        const results = await earningsTranscriptClient.getLatestTranscripts({
          limit,
          page,
        });
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
    "getEarningsTranscript",
    {
      symbol: z.string().describe("Stock symbol"),
      year: z.string().describe("Year of the earnings call"),
      quarter: z
        .string()
        .describe("Quarter of the earnings call (e.g., 1, 2, 3, 4)"),
      limit: z.number().optional().describe("Limit the number of results"),
    },
    async ({ symbol, year, quarter, limit }) => {
      try {
        const results = await earningsTranscriptClient.getTranscript({
          symbol,
          year,
          quarter,
          limit,
        });
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
    "getEarningsTranscriptDates",
    {
      symbol: z.string().describe("Stock symbol"),
    },
    async ({ symbol }) => {
      try {
        const results = await earningsTranscriptClient.getTranscriptDates({
          symbol,
        });
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

  server.tool("getAvailableTranscriptSymbols", {}, async () => {
    try {
      const results =
        await earningsTranscriptClient.getAvailableTranscriptSymbols();
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
