import { z } from "zod";
import { FundClient } from "../api/fund/FundClient.js";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

/**
 * Register all fund-related tools with the MCP server
 * @param server The MCP server instance
 * @param accessToken The Financial Modeling Prep API access token (optional when using lazy loading)
 */
export function registerFundTools(
  server: McpServer,
  accessToken?: string
): void {
  const fundClient = new FundClient(accessToken);

  server.tool(
    "getFundHoldings",
    {
      symbol: z.string().describe("Fund symbol"),
    },
    async ({ symbol }) => {
      try {
        const results = await fundClient.getHoldings(symbol);
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
    },
    async ({ symbol }) => {
      try {
        const results = await fundClient.getDisclosure(symbol);
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
      name: z.string().describe("Name of the holder to search for"),
    },
    async ({ name }) => {
      try {
        const results = await fundClient.searchDisclosures(name);
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
      cik: z.string().optional().describe("Optional CIK number"),
    },
    async ({ symbol, cik }) => {
      try {
        const results = await fundClient.getDisclosureDates(symbol, cik);
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
