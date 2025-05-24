import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { EconomicsClient } from "../api/economics/EconomicsClient.js";

/**
 * Register all economics-related tools with the MCP server
 * @param server The MCP server instance
 * @param accessToken The Financial Modeling Prep API access token (optional when using lazy loading)
 */
export function registerEconomicsTools(
  server: McpServer,
  accessToken?: string
): void {
  const economicsClient = new EconomicsClient(accessToken);

  server.tool(
    "getTreasuryRates",
    {
      limit: z
        .number()
        .optional()
        .describe("Optional limit on number of results"),
    },
    async ({ limit }) => {
      try {
        const results = await economicsClient.getTreasuryRates(limit);
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
    "getEconomicIndicators",
    {
      indicator: z
        .string()
        .optional()
        .describe("Optional specific indicator to get"),
      limit: z
        .number()
        .optional()
        .describe("Optional limit on number of results"),
    },
    async ({ indicator, limit }) => {
      try {
        const results = await economicsClient.getEconomicIndicators(
          indicator,
          limit
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
    "getEconomicCalendar",
    {
      from: z.string().describe("Start date (YYYY-MM-DD)"),
      to: z.string().describe("End date (YYYY-MM-DD)"),
    },
    async ({ from, to }) => {
      try {
        const results = await economicsClient.getEconomicCalendar(from, to);
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
    "getMarketRiskPremium",
    {
      limit: z
        .number()
        .optional()
        .describe("Optional limit on number of results"),
    },
    async ({ limit }) => {
      try {
        const results = await economicsClient.getMarketRiskPremium(limit);
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
