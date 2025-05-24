import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { AnalystClient } from "../api/analyst/AnalystClient.js";

/**
 * Register all analyst-related tools with the MCP server
 * @param server The MCP server instance
 * @param accessToken The Financial Modeling Prep API access token (optional when using lazy loading)
 */
export function registerAnalystTools(
  server: McpServer,
  accessToken?: string
): void {
  const analystClient = new AnalystClient(accessToken);

  server.tool(
    "getAnalystEstimates",
    {
      symbol: z.string().describe("Stock symbol"),
      period: z
        .enum(["annual", "quarter"])
        .describe("Period (annual or quarter)"),
      page: z.number().optional().describe("Optional page number (default: 0)"),
      limit: z
        .number()
        .optional()
        .describe(
          "Optional limit on number of results (default: 10, max: 1000)"
        ),
    },
    async ({ symbol, period, page, limit }) => {
      try {
        const results = await analystClient.getAnalystEstimates(
          symbol,
          period,
          page,
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
    "getRatingsSnapshot",
    {
      symbol: z.string().describe("Stock symbol"),
      limit: z
        .number()
        .optional()
        .describe("Optional limit on number of results (default: 1)"),
    },
    async ({ symbol, limit }) => {
      try {
        const results = await analystClient.getRatingsSnapshot(symbol, limit);
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
    "getHistoricalRatings",
    {
      symbol: z.string().describe("Stock symbol"),
      limit: z
        .number()
        .optional()
        .describe(
          "Optional limit on number of results (default: 1, max: 10000)"
        ),
    },
    async ({ symbol, limit }) => {
      try {
        const results = await analystClient.getHistoricalRatings(symbol, limit);
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
    "getPriceTargetSummary",
    {
      symbol: z.string().describe("Stock symbol"),
    },
    async ({ symbol }) => {
      try {
        const results = await analystClient.getPriceTargetSummary(symbol);
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
    "getPriceTargetConsensus",
    {
      symbol: z.string().describe("Stock symbol"),
    },
    async ({ symbol }) => {
      try {
        const results = await analystClient.getPriceTargetConsensus(symbol);
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
    "getPriceTargetNews",
    {
      symbol: z.string().describe("Stock symbol"),
      page: z.number().optional().describe("Optional page number (default: 0)"),
      limit: z
        .number()
        .optional()
        .describe("Optional limit on number of results (default: 10)"),
    },
    async ({ symbol, page, limit }) => {
      try {
        const results = await analystClient.getPriceTargetNews(
          symbol,
          page,
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
    "getPriceTargetLatestNews",
    {
      page: z
        .number()
        .optional()
        .describe("Optional page number (default: 0, max: 100)"),
      limit: z
        .number()
        .optional()
        .describe(
          "Optional limit on number of results (default: 10, max: 1000)"
        ),
    },
    async ({ page, limit }) => {
      try {
        const results = await analystClient.getPriceTargetLatestNews(
          page,
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
    "getStockGrades",
    {
      symbol: z.string().describe("Stock symbol"),
    },
    async ({ symbol }) => {
      try {
        const results = await analystClient.getStockGrades(symbol);
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
    "getHistoricalStockGrades",
    {
      symbol: z.string().describe("Stock symbol"),
      limit: z
        .number()
        .optional()
        .describe(
          "Optional limit on number of results (default: 100, max: 1000)"
        ),
    },
    async ({ symbol, limit }) => {
      try {
        const results = await analystClient.getHistoricalStockGrades(
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

  server.tool(
    "getStockGradeSummary",
    {
      symbol: z.string().describe("Stock symbol"),
    },
    async ({ symbol }) => {
      try {
        const results = await analystClient.getStockGradeSummary(symbol);
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
    "getStockGradeNews",
    {
      symbol: z.string().describe("Stock symbol"),
      page: z.number().optional().describe("Optional page number (default: 0)"),
      limit: z
        .number()
        .optional()
        .describe("Optional limit on number of results (default: 1, max: 100)"),
    },
    async ({ symbol, page, limit }) => {
      try {
        const results = await analystClient.getStockGradeNews(
          symbol,
          page,
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
    "getStockGradeLatestNews",
    {
      page: z
        .number()
        .optional()
        .describe("Optional page number (default: 0, max: 100)"),
      limit: z
        .number()
        .optional()
        .describe(
          "Optional limit on number of results (default: 10, max: 1000)"
        ),
    },
    async ({ page, limit }) => {
      try {
        const results = await analystClient.getStockGradeLatestNews(
          page,
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
