import { z } from "zod";
import { GovernmentTradingClient } from "../api/government-trading/GovernmentTradingClient.js";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

/**
 * Register all government trading-related tools with the MCP server
 * @param server The MCP server instance
 * @param accessToken The Financial Modeling Prep API access token (optional when using lazy loading)
 */
export function registerGovernmentTradingTools(
  server: McpServer,
  accessToken?: string
): void {
  const governmentTradingClient = new GovernmentTradingClient(accessToken);

  server.tool(
    "getLatestSenateDisclosures",
    {
      page: z.number().optional().describe("Page number for pagination"),
      limit: z.number().optional().describe("Limit the number of results"),
    },
    async ({ page, limit }) => {
      try {
        const results =
          await governmentTradingClient.getLatestSenateDisclosures({
            page,
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
    "getLatestHouseDisclosures",
    {
      page: z.number().optional().describe("Page number for pagination"),
      limit: z.number().optional().describe("Limit the number of results"),
    },
    async ({ page, limit }) => {
      try {
        const results = await governmentTradingClient.getLatestHouseDisclosures(
          {
            page,
            limit,
          }
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

  server.tool(
    "getSenateTrades",
    {
      symbol: z.string().describe("Stock symbol"),
    },
    async ({ symbol }) => {
      try {
        const results = await governmentTradingClient.getSenateTrades({
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

  server.tool(
    "getSenateTradesByName",
    {
      name: z.string().describe("Senator name (first or last name)"),
    },
    async ({ name }) => {
      try {
        const results = await governmentTradingClient.getSenateTradesByName({
          name,
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
    "getHouseTrades",
    {
      symbol: z.string().describe("Stock symbol"),
    },
    async ({ symbol }) => {
      try {
        const results = await governmentTradingClient.getHouseTrades({
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

  server.tool(
    "getHouseTradesByName",
    {
      name: z.string().describe("Representative name (first or last name)"),
    },
    async ({ name }) => {
      try {
        const results = await governmentTradingClient.getHouseTradesByName({
          name,
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
}
