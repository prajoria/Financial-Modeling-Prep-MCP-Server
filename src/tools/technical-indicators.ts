import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { TechnicalIndicatorsClient } from "../api/technical-indicators/TechnicalIndicatorsClient.js";

/**
 * Register all technical indicators-related tools with the MCP server
 * @param server The MCP server instance
 * @param accessToken The Financial Modeling Prep API access token
 */
export function registerTechnicalIndicatorsTools(
  server: McpServer,
  accessToken: string
): void {
  const technicalIndicatorsClient = new TechnicalIndicatorsClient(accessToken);

  server.tool(
    "getSMA",
    {
      symbol: z.string().describe("Stock symbol"),
      periodLength: z.number().describe("Period length for the indicator"),
      timeframe: z
        .string()
        .describe("Timeframe (1min, 5min, 15min, 30min, 1hour, 4hour, 1day)"),
      from: z.string().optional().describe("Start date (YYYY-MM-DD)"),
      to: z.string().optional().describe("End date (YYYY-MM-DD)"),
    },
    async ({ symbol, periodLength, timeframe, from, to }) => {
      try {
        const results = await technicalIndicatorsClient.getSMA({
          symbol,
          periodLength,
          timeframe,
          from,
          to,
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
    "getEMA",
    {
      symbol: z.string().describe("Stock symbol"),
      periodLength: z.number().describe("Period length for the indicator"),
      timeframe: z
        .string()
        .describe("Timeframe (1min, 5min, 15min, 30min, 1hour, 4hour, 1day)"),
      from: z.string().optional().describe("Start date (YYYY-MM-DD)"),
      to: z.string().optional().describe("End date (YYYY-MM-DD)"),
    },
    async ({ symbol, periodLength, timeframe, from, to }) => {
      try {
        const results = await technicalIndicatorsClient.getEMA({
          symbol,
          periodLength,
          timeframe,
          from,
          to,
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
    "getWMA",
    {
      symbol: z.string().describe("Stock symbol"),
      periodLength: z.number().describe("Period length for the indicator"),
      timeframe: z
        .string()
        .describe("Timeframe (1min, 5min, 15min, 30min, 1hour, 4hour, 1day)"),
      from: z.string().optional().describe("Start date (YYYY-MM-DD)"),
      to: z.string().optional().describe("End date (YYYY-MM-DD)"),
    },
    async ({ symbol, periodLength, timeframe, from, to }) => {
      try {
        const results = await technicalIndicatorsClient.getWMA({
          symbol,
          periodLength,
          timeframe,
          from,
          to,
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
    "getDEMA",
    {
      symbol: z.string().describe("Stock symbol"),
      periodLength: z.number().describe("Period length for the indicator"),
      timeframe: z
        .string()
        .describe("Timeframe (1min, 5min, 15min, 30min, 1hour, 4hour, 1day)"),
      from: z.string().optional().describe("Start date (YYYY-MM-DD)"),
      to: z.string().optional().describe("End date (YYYY-MM-DD)"),
    },
    async ({ symbol, periodLength, timeframe, from, to }) => {
      try {
        const results = await technicalIndicatorsClient.getDEMA({
          symbol,
          periodLength,
          timeframe,
          from,
          to,
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
    "getTEMA",
    {
      symbol: z.string().describe("Stock symbol"),
      periodLength: z.number().describe("Period length for the indicator"),
      timeframe: z
        .string()
        .describe("Timeframe (1min, 5min, 15min, 30min, 1hour, 4hour, 1day)"),
      from: z.string().optional().describe("Start date (YYYY-MM-DD)"),
      to: z.string().optional().describe("End date (YYYY-MM-DD)"),
    },
    async ({ symbol, periodLength, timeframe, from, to }) => {
      try {
        const results = await technicalIndicatorsClient.getTEMA({
          symbol,
          periodLength,
          timeframe,
          from,
          to,
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
    "getRSI",
    {
      symbol: z.string().describe("Stock symbol"),
      periodLength: z.number().describe("Period length for the indicator"),
      timeframe: z
        .string()
        .describe("Timeframe (1min, 5min, 15min, 30min, 1hour, 4hour, 1day)"),
      from: z.string().optional().describe("Start date (YYYY-MM-DD)"),
      to: z.string().optional().describe("End date (YYYY-MM-DD)"),
    },
    async ({ symbol, periodLength, timeframe, from, to }) => {
      try {
        const results = await technicalIndicatorsClient.getRSI({
          symbol,
          periodLength,
          timeframe,
          from,
          to,
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
    "getStandardDeviation",
    {
      symbol: z.string().describe("Stock symbol"),
      periodLength: z.number().describe("Period length for the indicator"),
      timeframe: z
        .string()
        .describe("Timeframe (1min, 5min, 15min, 30min, 1hour, 4hour, 1day)"),
      from: z.string().optional().describe("Start date (YYYY-MM-DD)"),
      to: z.string().optional().describe("End date (YYYY-MM-DD)"),
    },
    async ({ symbol, periodLength, timeframe, from, to }) => {
      try {
        const results = await technicalIndicatorsClient.getStandardDeviation({
          symbol,
          periodLength,
          timeframe,
          from,
          to,
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
    "getWilliams",
    {
      symbol: z.string().describe("Stock symbol"),
      periodLength: z.number().describe("Period length for the indicator"),
      timeframe: z
        .string()
        .describe("Timeframe (1min, 5min, 15min, 30min, 1hour, 4hour, 1day)"),
      from: z.string().optional().describe("Start date (YYYY-MM-DD)"),
      to: z.string().optional().describe("End date (YYYY-MM-DD)"),
    },
    async ({ symbol, periodLength, timeframe, from, to }) => {
      try {
        const results = await technicalIndicatorsClient.getWilliams({
          symbol,
          periodLength,
          timeframe,
          from,
          to,
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
    "getADX",
    {
      symbol: z.string().describe("Stock symbol"),
      periodLength: z.number().describe("Period length for the indicator"),
      timeframe: z
        .string()
        .describe("Timeframe (1min, 5min, 15min, 30min, 1hour, 4hour, 1day)"),
      from: z.string().optional().describe("Start date (YYYY-MM-DD)"),
      to: z.string().optional().describe("End date (YYYY-MM-DD)"),
    },
    async ({ symbol, periodLength, timeframe, from, to }) => {
      try {
        const results = await technicalIndicatorsClient.getADX({
          symbol,
          periodLength,
          timeframe,
          from,
          to,
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
