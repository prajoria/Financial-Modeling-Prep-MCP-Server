import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { FundClient } from "../api/fund/FundClient.js";

/**
 * Register all fund-related tools with the MCP server
 * @param server The MCP server instance
 * @param accessToken The Financial Modeling Prep API access token
 */
export function registerFundTools(
  server: McpServer,
  accessToken: string
): void {
  const fundClient = new FundClient(accessToken);

  server.tool(
    "getFundHoldings",
    {
      symbol: z.string().describe("Fund symbol"),
      limit: z
        .number()
        .optional()
        .describe("Optional limit on number of results"),
    },
    async ({ symbol, limit }) => {
      try {
        const results = await fundClient.getHoldings(symbol, limit);
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
    "getFundInfo",
    {
      symbol: z.string().describe("Fund symbol"),
    },
    async ({ symbol }) => {
      try {
        const results = await fundClient.getInfo(symbol);
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
    "getFundCountryAllocation",
    {
      symbol: z.string().describe("Fund symbol"),
    },
    async ({ symbol }) => {
      try {
        const results = await fundClient.getCountryAllocation(symbol);
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
    "getFundAssetExposure",
    {
      symbol: z.string().describe("Fund symbol"),
    },
    async ({ symbol }) => {
      try {
        const results = await fundClient.getAssetExposure(symbol);
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
    "getFundSectorWeighting",
    {
      symbol: z.string().describe("Fund symbol"),
    },
    async ({ symbol }) => {
      try {
        const results = await fundClient.getSectorWeighting(symbol);
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
    "getFundDisclosure",
    {
      symbol: z.string().describe("Fund symbol"),
      limit: z
        .number()
        .optional()
        .describe("Optional limit on number of results"),
    },
    async ({ symbol, limit }) => {
      try {
        const results = await fundClient.getDisclosure(symbol, limit);
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
    "searchFundDisclosures",
    {
      query: z.string().describe("Search query"),
      limit: z
        .number()
        .optional()
        .describe("Optional limit on number of results"),
    },
    async ({ query, limit }) => {
      try {
        const results = await fundClient.searchDisclosures(query, limit);
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
    "getFundDisclosureDates",
    {
      symbol: z.string().describe("Fund symbol"),
    },
    async ({ symbol }) => {
      try {
        const results = await fundClient.getDisclosureDates(symbol);
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
