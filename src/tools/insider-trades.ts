import { z } from "zod";
import { InsiderTradesClient } from "../api/insider-trades/InsiderTradesClient.js";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

/**
 * Register all insider trades-related tools with the MCP server
 * @param server The MCP server instance
 * @param accessToken The Financial Modeling Prep API access token (optional when using lazy loading)
 */
export function registerInsiderTradesTools(
  server: McpServer,
  accessToken?: string
): void {
  const insiderTradesClient = new InsiderTradesClient(accessToken);

  server.tool(
    "getLatestInsiderTrading",
    {
      date: z
        .string()
        .optional()
        .describe("Date of insider trades (YYYY-MM-DD)"),
      page: z.number().optional().describe("Page number (default: 0)"),
      limit: z
        .number()
        .optional()
        .describe("Limit on number of results (default: 100, max: 100)"),
    },
    async ({ date, page, limit }) => {
      try {
        const results = await insiderTradesClient.getLatestInsiderTrading({
          date,
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
    "searchInsiderTrades",
    {
      symbol: z.string().optional().describe("Stock symbol"),
      page: z.number().optional().describe("Page number (default: 0)"),
      limit: z
        .number()
        .optional()
        .describe("Limit on number of results (default: 100, max: 100)"),
      reportingCik: z.string().optional().describe("Reporting CIK number"),
      companyCik: z.string().optional().describe("Company CIK number"),
      transactionType: z
        .string()
        .optional()
        .describe("Transaction type (e.g., S-Sale)"),
    },
    async ({
      symbol,
      page,
      limit,
      reportingCik,
      companyCik,
      transactionType,
    }) => {
      try {
        const results = await insiderTradesClient.searchInsiderTrades({
          symbol,
          page,
          limit,
          reportingCik,
          companyCik,
          transactionType,
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
    "searchInsiderTradesByReportingName",
    {
      name: z.string().describe("Reporting person's name to search for"),
    },
    async ({ name }) => {
      try {
        const results =
          await insiderTradesClient.searchInsiderTradesByReportingName(name);
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

  server.tool("getInsiderTransactionTypes", {}, async () => {
    try {
      const results = await insiderTradesClient.getInsiderTransactionTypes();
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
    "getInsiderTradeStatistics",
    {
      symbol: z.string().describe("Stock symbol"),
    },
    async ({ symbol }) => {
      try {
        const results = await insiderTradesClient.getInsiderTradeStatistics(
          symbol
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
    "getAcquisitionOwnership",
    {
      symbol: z.string().describe("Stock symbol"),
      limit: z
        .number()
        .optional()
        .describe("Limit on number of results (default: 2000)"),
    },
    async ({ symbol, limit }) => {
      try {
        const results = await insiderTradesClient.getAcquisitionOwnership(
          symbol,
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
}
