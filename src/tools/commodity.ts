import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { CommodityClient } from "../api/commodity/CommodityClient.js";

/**
 * Register all commodity-related tools with the MCP server
 * @param server The MCP server instance
 * @param accessToken The Financial Modeling Prep API access token
 */
export function registerCommodityTools(
  server: McpServer,
  accessToken: string
): void {
  const commodityClient = new CommodityClient(accessToken);

  server.tool(
    "getCommodityPrice",
    {
      symbol: z.string().describe("Commodity symbol"),
    },
    async ({ symbol }) => {
      try {
        const results = await commodityClient.getPrice(symbol);
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
    "getCommodityHistoricalPrices",
    {
      symbol: z.string().describe("Commodity symbol"),
      limit: z
        .number()
        .optional()
        .describe("Optional limit on number of results"),
    },
    async ({ symbol, limit }) => {
      try {
        const results = await commodityClient.getHistoricalPrices(
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
    "getCommodityQuote",
    {
      symbol: z.string().describe("Commodity symbol"),
    },
    async ({ symbol }) => {
      try {
        const results = await commodityClient.getQuote(symbol);
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
    "getCommodityContract",
    {
      symbol: z.string().describe("Commodity symbol"),
    },
    async ({ symbol }) => {
      try {
        const results = await commodityClient.getContract(symbol);
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
    "getCommodityMarketData",
    {
      symbol: z.string().describe("Commodity symbol"),
    },
    async ({ symbol }) => {
      try {
        const results = await commodityClient.getMarketData(symbol);
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
    "getCommodityNews",
    {
      symbol: z.string().describe("Commodity symbol"),
      limit: z
        .number()
        .optional()
        .describe("Optional limit on number of results"),
    },
    async ({ symbol, limit }) => {
      try {
        const results = await commodityClient.getNews(symbol, limit);
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
    "getCommodityForecast",
    {
      symbol: z.string().describe("Commodity symbol"),
    },
    async ({ symbol }) => {
      try {
        const results = await commodityClient.getForecast(symbol);
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
    "getCommoditySupplyDemand",
    {
      symbol: z.string().describe("Commodity symbol"),
    },
    async ({ symbol }) => {
      try {
        const results = await commodityClient.getSupplyDemand(symbol);
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
