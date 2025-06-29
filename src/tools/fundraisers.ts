import { z } from "zod";
import { FundraisersClient } from "../api/fundraisers/FundraisersClient.js";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

/**
 * Register all fundraisers-related tools with the MCP server
 * @param server The MCP server instance
 * @param accessToken The Financial Modeling Prep API access token (optional when using lazy loading)
 */
export function registerFundraisersTools(
  server: McpServer,
  accessToken?: string
): void {
  const fundraisersClient = new FundraisersClient(accessToken);

  server.tool(
    "getLatestCrowdfundingCampaigns",
    {
      page: z.number().optional().describe("Page number (default: 0)"),
      limit: z
        .number()
        .optional()
        .describe("Limit on number of results (default: 100, max: 1000)"),
    },
    async ({ page, limit }) => {
      try {
        const results = await fundraisersClient.getLatestCrowdfundingCampaigns(
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
    "searchCrowdfundingCampaigns",
    {
      name: z
        .string()
        .describe("Company name, campaign name, or platform to search for"),
    },
    async ({ name }) => {
      try {
        const results = await fundraisersClient.searchCrowdfundingCampaigns(
          name
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
    "getCrowdfundingCampaignsByCIK",
    {
      cik: z.string().describe("CIK number to search for"),
    },
    async ({ cik }) => {
      try {
        const results = await fundraisersClient.getCrowdfundingCampaignsByCIK(
          cik
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
    "getLatestEquityOfferings",
    {
      page: z.number().optional().describe("Page number (default: 0)"),
      limit: z
        .number()
        .optional()
        .describe("Limit on number of results (default: 10, max: 1000)"),
      cik: z.string().optional().describe("Optional CIK number to filter by"),
    },
    async ({ page, limit, cik }) => {
      try {
        const results = await fundraisersClient.getLatestEquityOfferings(
          page,
          limit,
          cik
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
    "searchEquityOfferings",
    {
      name: z.string().describe("Company name or stock symbol to search for"),
    },
    async ({ name }) => {
      try {
        const results = await fundraisersClient.searchEquityOfferings(name);
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
    "getEquityOfferingsByCIK",
    {
      cik: z.string().describe("CIK number to search for"),
    },
    async ({ cik }) => {
      try {
        const results = await fundraisersClient.getEquityOfferingsByCIK(cik);
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
