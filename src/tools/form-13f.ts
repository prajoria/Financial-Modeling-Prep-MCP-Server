import { z } from "zod";
import { Form13FClient } from "../api/form-13f/Form13FClient.js";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

/**
 * Register all Form 13F-related tools with the MCP server
 * @param server The MCP server instance
 * @param accessToken The Financial Modeling Prep API access token (optional when using lazy loading)
 */
export function registerForm13FTools(
  server: McpServer,
  accessToken?: string
): void {
  const form13fClient = new Form13FClient(accessToken);

  server.tool(
    "getLatestInstitutionalFilings",
    {
      page: z.number().optional().describe("Page number (default: 0)"),
      limit: z
        .number()
        .optional()
        .describe("Limit on number of results (default: 100, max: 100)"),
    },
    async ({ page, limit }) => {
      try {
        const results = await form13fClient.getLatestFilings({ page, limit });
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
    "getSecFilingExtract",
    {
      cik: z.string().describe("CIK number"),
      year: z.union([z.string(), z.number()]).describe("Year of filing"),
      quarter: z
        .union([z.string(), z.number()])
        .describe("Quarter of filing (1-4)"),
    },
    async ({ cik, year, quarter }) => {
      try {
        const results = await form13fClient.getFilingExtract(
          cik,
          year,
          quarter
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
    "getForm13FFilingDates",
    {
      cik: z.string().describe("CIK number"),
    },
    async ({ cik }) => {
      try {
        const results = await form13fClient.getFilingDates(cik);
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
    "getFilingExtractAnalyticsByHolder",
    {
      symbol: z.string().describe("Stock symbol"),
      year: z.union([z.string(), z.number()]).describe("Year of filing"),
      quarter: z
        .union([z.string(), z.number()])
        .describe("Quarter of filing (1-4)"),
      page: z.number().optional().describe("Page number (default: 0)"),
      limit: z
        .number()
        .optional()
        .describe("Limit on number of results (default: 10, max: 100)"),
    },
    async ({ symbol, year, quarter, page, limit }) => {
      try {
        const results = await form13fClient.getFilingExtractAnalyticsByHolder(
          symbol,
          year,
          quarter,
          { page, limit }
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
    "getHolderPerformanceSummary",
    {
      cik: z.string().describe("CIK number"),
      page: z.number().optional().describe("Page number (default: 0)"),
    },
    async ({ cik, page }) => {
      try {
        const results = await form13fClient.getHolderPerformanceSummary(cik, {
          page,
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
    "getHolderIndustryBreakdown",
    {
      cik: z.string().describe("CIK number"),
      year: z.union([z.string(), z.number()]).describe("Year of filing"),
      quarter: z
        .union([z.string(), z.number()])
        .describe("Quarter of filing (1-4)"),
    },
    async ({ cik, year, quarter }) => {
      try {
        const results = await form13fClient.getHolderIndustryBreakdown(
          cik,
          year,
          quarter
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
    "getPositionsSummary",
    {
      symbol: z.string().describe("Stock symbol"),
      year: z.union([z.string(), z.number()]).describe("Year of filing"),
      quarter: z
        .union([z.string(), z.number()])
        .describe("Quarter of filing (1-4)"),
    },
    async ({ symbol, year, quarter }) => {
      try {
        const results = await form13fClient.getPositionsSummary(
          symbol,
          year,
          quarter
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
    "getIndustryPerformanceSummary",
    {
      year: z.union([z.string(), z.number()]).describe("Year of filing"),
      quarter: z
        .union([z.string(), z.number()])
        .describe("Quarter of filing (1-4)"),
    },
    async ({ year, quarter }) => {
      try {
        const results = await form13fClient.getIndustryPerformanceSummary(
          year,
          quarter
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
