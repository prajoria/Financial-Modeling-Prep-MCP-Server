import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { MarketPerformanceClient } from "../api/market-performance/MarketPerformanceClient.js";

/**
 * Register all market performance-related tools with the MCP server
 * @param server The MCP server instance
 * @param accessToken The Financial Modeling Prep API access token (optional when using lazy loading)
 */
export function registerMarketPerformanceTools(
  server: McpServer,
  accessToken?: string
): void {
  const marketPerformanceClient = new MarketPerformanceClient(accessToken);

  server.tool(
    "getSectorPerformanceSnapshot",
    {
      date: z.string().describe("Date (YYYY-MM-DD)"),
      exchange: z.string().optional().describe("Exchange (e.g., NASDAQ)"),
      sector: z.string().optional().describe("Sector (e.g., Energy)"),
    },
    async ({ date, exchange, sector }) => {
      try {
        const results =
          await marketPerformanceClient.getSectorPerformanceSnapshot(date, {
            exchange,
            sector,
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
    "getIndustryPerformanceSnapshot",
    {
      date: z.string().describe("Date (YYYY-MM-DD)"),
      exchange: z.string().optional().describe("Exchange (e.g., NASDAQ)"),
      industry: z
        .string()
        .optional()
        .describe("Industry (e.g., Biotechnology)"),
    },
    async ({ date, exchange, industry }) => {
      try {
        const results =
          await marketPerformanceClient.getIndustryPerformanceSnapshot(date, {
            exchange,
            industry,
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
    "getHistoricalSectorPerformance",
    {
      sector: z.string().describe("Sector (e.g., Energy)"),
      from: z.string().optional().describe("Start date (YYYY-MM-DD)"),
      to: z.string().optional().describe("End date (YYYY-MM-DD)"),
      exchange: z.string().optional().describe("Exchange (e.g., NASDAQ)"),
    },
    async ({ sector, from, to, exchange }) => {
      try {
        const results =
          await marketPerformanceClient.getHistoricalSectorPerformance(sector, {
            from,
            to,
            exchange,
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
    "getHistoricalIndustryPerformance",
    {
      industry: z.string().describe("Industry (e.g., Biotechnology)"),
      from: z.string().optional().describe("Start date (YYYY-MM-DD)"),
      to: z.string().optional().describe("End date (YYYY-MM-DD)"),
      exchange: z.string().optional().describe("Exchange (e.g., NASDAQ)"),
    },
    async ({ industry, from, to, exchange }) => {
      try {
        const results =
          await marketPerformanceClient.getHistoricalIndustryPerformance(
            industry,
            { from, to, exchange }
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
    "getSectorPESnapshot",
    {
      date: z.string().describe("Date (YYYY-MM-DD)"),
      exchange: z.string().optional().describe("Exchange (e.g., NASDAQ)"),
      sector: z.string().optional().describe("Sector (e.g., Energy)"),
    },
    async ({ date, exchange, sector }) => {
      try {
        const results = await marketPerformanceClient.getSectorPESnapshot(
          date,
          {
            exchange,
            sector,
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
    "getIndustryPESnapshot",
    {
      date: z.string().describe("Date (YYYY-MM-DD)"),
      exchange: z.string().optional().describe("Exchange (e.g., NASDAQ)"),
      industry: z
        .string()
        .optional()
        .describe("Industry (e.g., Biotechnology)"),
    },
    async ({ date, exchange, industry }) => {
      try {
        const results = await marketPerformanceClient.getIndustryPESnapshot(
          date,
          { exchange, industry }
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
    "getHistoricalSectorPE",
    {
      sector: z.string().describe("Sector (e.g., Energy)"),
      from: z.string().optional().describe("Start date (YYYY-MM-DD)"),
      to: z.string().optional().describe("End date (YYYY-MM-DD)"),
      exchange: z.string().optional().describe("Exchange (e.g., NASDAQ)"),
    },
    async ({ sector, from, to, exchange }) => {
      try {
        const results = await marketPerformanceClient.getHistoricalSectorPE(
          sector,
          { from, to, exchange }
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
    "getHistoricalIndustryPE",
    {
      industry: z.string().describe("Industry (e.g., Biotechnology)"),
      from: z.string().optional().describe("Start date (YYYY-MM-DD)"),
      to: z.string().optional().describe("End date (YYYY-MM-DD)"),
      exchange: z.string().optional().describe("Exchange (e.g., NASDAQ)"),
    },
    async ({ industry, from, to, exchange }) => {
      try {
        const results = await marketPerformanceClient.getHistoricalIndustryPE(
          industry,
          { from, to, exchange }
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

  server.tool("getBiggestGainers", {}, async () => {
    try {
      const results = await marketPerformanceClient.getBiggestGainers();
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

  server.tool("getBiggestLosers", {}, async () => {
    try {
      const results = await marketPerformanceClient.getBiggestLosers();
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

  server.tool("getMostActiveStocks", {}, async () => {
    try {
      const results = await marketPerformanceClient.getMostActiveStocks();
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
