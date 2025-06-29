import { z } from "zod";
import { SECFilingsClient } from "../api/sec-filings/SECFilingsClient.js";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

/**
 * Register all SEC filings-related tools with the MCP server
 * @param server The MCP server instance
 * @param accessToken The Financial Modeling Prep API access token (optional when using lazy loading)
 */
export function registerSECFilingsTools(
  server: McpServer,
  accessToken?: string
): void {
  const secFilingsClient = new SECFilingsClient(accessToken);

  server.tool(
    "getLatest8KFilings",
    {
      from: z.string().describe("Start date (YYYY-MM-DD)"),
      to: z.string().describe("End date (YYYY-MM-DD)"),
      page: z.number().optional().describe("Page number for pagination"),
      limit: z.number().optional().describe("Limit the number of results"),
    },
    async ({ from, to, page, limit }) => {
      try {
        const results = await secFilingsClient.getLatest8KFilings({
          from,
          to,
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
    "getLatestFinancialFilings",
    {
      from: z.string().describe("Start date (YYYY-MM-DD)"),
      to: z.string().describe("End date (YYYY-MM-DD)"),
      page: z.number().optional().describe("Page number for pagination"),
      limit: z.number().optional().describe("Limit the number of results"),
    },
    async ({ from, to, page, limit }) => {
      try {
        const results = await secFilingsClient.getLatestFinancialFilings({
          from,
          to,
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
    "getFilingsByFormType",
    {
      formType: z.string().describe("Form type (e.g., 8-K, 10-K, 10-Q)"),
      from: z.string().describe("Start date (YYYY-MM-DD)"),
      to: z.string().describe("End date (YYYY-MM-DD)"),
      page: z.number().optional().describe("Page number for pagination"),
      limit: z.number().optional().describe("Limit the number of results"),
    },
    async ({ formType, from, to, page, limit }) => {
      try {
        const results = await secFilingsClient.getFilingsByFormType({
          formType,
          from,
          to,
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
    "getFilingsBySymbol",
    {
      symbol: z.string().describe("Stock symbol"),
      from: z.string().describe("Start date (YYYY-MM-DD)"),
      to: z.string().describe("End date (YYYY-MM-DD)"),
      page: z.number().optional().describe("Page number for pagination"),
      limit: z.number().optional().describe("Limit the number of results"),
    },
    async ({ symbol, from, to, page, limit }) => {
      try {
        const results = await secFilingsClient.getFilingsBySymbol({
          symbol,
          from,
          to,
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
    "getFilingsByCIK",
    {
      cik: z.string().describe("Central Index Key (CIK)"),
      from: z.string().describe("Start date (YYYY-MM-DD)"),
      to: z.string().describe("End date (YYYY-MM-DD)"),
      page: z.number().optional().describe("Page number for pagination"),
      limit: z.number().optional().describe("Limit the number of results"),
    },
    async ({ cik, from, to, page, limit }) => {
      try {
        const results = await secFilingsClient.getFilingsByCIK({
          cik,
          from,
          to,
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
    "searchCompaniesByName",
    {
      company: z.string().describe("Company name or partial name"),
    },
    async ({ company }) => {
      try {
        const results = await secFilingsClient.searchCompaniesByName({
          company,
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
    "searchCompaniesBySymbol",
    {
      symbol: z.string().describe("Stock symbol"),
    },
    async ({ symbol }) => {
      try {
        const results = await secFilingsClient.searchCompaniesBySymbol({
          symbol,
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
    "searchCompaniesByCIK",
    {
      cik: z.string().describe("Central Index Key (CIK)"),
    },
    async ({ cik }) => {
      try {
        const results = await secFilingsClient.searchCompaniesByCIK({
          cik,
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
    "getCompanySECProfile",
    {
      symbol: z.string().optional().describe("Stock symbol"),
      cik: z.string().optional().describe("Central Index Key (CIK)"),
    },
    async ({ symbol, cik }) => {
      try {
        const results = await secFilingsClient.getCompanyProfile({
          symbol,
          cik,
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
    "getIndustryClassificationList",
    {
      industryTitle: z
        .string()
        .optional()
        .describe("Industry title or partial title"),
      sicCode: z.string().optional().describe("SIC code"),
    },
    async ({ industryTitle, sicCode }) => {
      try {
        const results = await secFilingsClient.getIndustryClassificationList({
          industryTitle,
          sicCode,
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
    "searchIndustryClassification",
    {
      symbol: z.string().optional().describe("Stock symbol"),
      cik: z.string().optional().describe("Central Index Key (CIK)"),
      sicCode: z.string().optional().describe("SIC code"),
    },
    async ({ symbol, cik, sicCode }) => {
      try {
        const results = await secFilingsClient.searchIndustryClassification({
          symbol,
          cik,
          sicCode,
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
    "getAllIndustryClassification",
    {
      page: z.number().optional().describe("Page number for pagination"),
      limit: z.number().optional().describe("Limit the number of results"),
    },
    async ({ page, limit }) => {
      try {
        const results = await secFilingsClient.getAllIndustryClassification({
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
}
