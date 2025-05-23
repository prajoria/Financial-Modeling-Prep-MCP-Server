import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { MarketHoursClient } from "../api/market-hours/MarketHoursClient.js";

/**
 * Register all market hours-related tools with the MCP server
 * @param server The MCP server instance
 * @param accessToken The Financial Modeling Prep API access token
 */
export function registerMarketHoursTools(
  server: McpServer,
  accessToken: string
): void {
  const marketHoursClient = new MarketHoursClient(accessToken);

  server.tool(
    "getExchangeMarketHours",
    {
      exchange: z.string().describe("Exchange code (e.g., NASDAQ, NYSE)"),
    },
    async ({ exchange }) => {
      try {
        const results = await marketHoursClient.getExchangeMarketHours(
          exchange
        );
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

  server.tool("getAllExchangeMarketHours", {}, async () => {
    try {
      const results = await marketHoursClient.getAllExchangeMarketHours();
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
