import { z } from "zod";
import { CryptoClient } from "../api/crypto/CryptoClient.js";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

/**
 * Register all cryptocurrency-related tools with the MCP server
 * @param server The MCP server instance
 * @param accessToken The Financial Modeling Prep API access token (optional when using lazy loading)
 */
export function registerCryptoTools(
  server: McpServer,
  accessToken?: string
): void {
  const cryptoClient = new CryptoClient(accessToken);

  server.tool("getCryptocurrencyList", {}, async () => {
    try {
      const results = await cryptoClient.getList();
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
    "getCryptocurrencyQuote",
    {
      symbol: z.string().describe("Cryptocurrency symbol (e.g., BTCUSD)"),
    },
    async ({ symbol }) => {
      try {
        const results = await cryptoClient.getQuote(symbol);
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
    "getCryptocurrencyShortQuote",
    {
      symbol: z.string().describe("Cryptocurrency symbol (e.g., BTCUSD)"),
    },
    async ({ symbol }) => {
      try {
        const results = await cryptoClient.getShortQuote(symbol);
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
    "getCryptocurrencyBatchQuotes",
    {
      short: z.boolean().optional().describe("Get short quotes instead of full quotes"),
    },
    async ({ short }) => {
      try {
        const results = await cryptoClient.getBatchQuotes(short);
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
    "getCryptocurrencyHistoricalLightChart",
    {
      symbol: z.string().describe("Cryptocurrency symbol (e.g., BTCUSD)"),
      from: z.string().optional().describe("Start date (YYYY-MM-DD)"),
      to: z.string().optional().describe("End date (YYYY-MM-DD)"),
    },
    async ({ symbol, from, to }) => {
      try {
        const results = await cryptoClient.getHistoricalLightChart(
          symbol,
          from,
          to
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
    "getCryptocurrencyHistoricalFullChart",
    {
      symbol: z.string().describe("Cryptocurrency symbol (e.g., BTCUSD)"),
      from: z.string().optional().describe("Start date (YYYY-MM-DD)"),
      to: z.string().optional().describe("End date (YYYY-MM-DD)"),
    },
    async ({ symbol, from, to }) => {
      try {
        const results = await cryptoClient.getHistoricalFullChart(
          symbol,
          from,
          to
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
    "getCryptocurrency1MinuteData",
    {
      symbol: z.string().describe("Cryptocurrency symbol (e.g., BTCUSD)"),
      from: z.string().optional().describe("Start date (YYYY-MM-DD)"),
      to: z.string().optional().describe("End date (YYYY-MM-DD)"),
    },
    async ({ symbol, from, to }) => {
      try {
        const results = await cryptoClient.get1MinuteData(symbol, from, to);
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
    "getCryptocurrency5MinuteData",
    {
      symbol: z.string().describe("Cryptocurrency symbol (e.g., BTCUSD)"),
      from: z.string().optional().describe("Start date (YYYY-MM-DD)"),
      to: z.string().optional().describe("End date (YYYY-MM-DD)"),
    },
    async ({ symbol, from, to }) => {
      try {
        const results = await cryptoClient.get5MinuteData(symbol, from, to);
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
    "getCryptocurrency1HourData",
    {
      symbol: z.string().describe("Cryptocurrency symbol (e.g., BTCUSD)"),
      from: z.string().optional().describe("Start date (YYYY-MM-DD)"),
      to: z.string().optional().describe("End date (YYYY-MM-DD)"),
    },
    async ({ symbol, from, to }) => {
      try {
        const results = await cryptoClient.get1HourData(symbol, from, to);
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
