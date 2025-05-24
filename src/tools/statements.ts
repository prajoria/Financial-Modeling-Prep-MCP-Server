import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { StatementsClient } from "../api/statements/StatementsClient.js";

/**
 * Register all financial statements-related tools with the MCP server
 * @param server The MCP server instance
 * @param accessToken The Financial Modeling Prep API access token (optional when using lazy loading)
 */
export function registerStatementsTools(
  server: McpServer,
  accessToken?: string
): void {
  const statementsClient = new StatementsClient(accessToken);

  server.tool(
    "getIncomeStatement",
    {
      symbol: z.string().describe("Stock symbol"),
      limit: z
        .number()
        .optional()
        .describe("Limit on number of results (default: 100, max: 1000)"),
      period: z
        .enum(["Q1", "Q2", "Q3", "Q4", "FY"])
        .optional()
        .describe("Period (Q1, Q2, Q3, Q4, or FY)"),
    },
    async ({ symbol, limit, period }) => {
      try {
        const results = await statementsClient.getIncomeStatement(symbol, {
          limit,
          period,
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
    "getBalanceSheetStatement",
    {
      symbol: z.string().describe("Stock symbol"),
      limit: z
        .number()
        .optional()
        .describe("Limit on number of results (default: 100, max: 1000)"),
      period: z
        .enum(["Q1", "Q2", "Q3", "Q4", "FY"])
        .optional()
        .describe("Period (Q1, Q2, Q3, Q4, or FY)"),
    },
    async ({ symbol, limit, period }) => {
      try {
        const results = await statementsClient.getBalanceSheetStatement(
          symbol,
          {
            limit,
            period,
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
    "getCashFlowStatement",
    {
      symbol: z.string().describe("Stock symbol"),
      limit: z
        .number()
        .optional()
        .describe("Limit on number of results (default: 100, max: 1000)"),
      period: z
        .enum(["Q1", "Q2", "Q3", "Q4", "FY"])
        .optional()
        .describe("Period (Q1, Q2, Q3, Q4, or FY)"),
    },
    async ({ symbol, limit, period }) => {
      try {
        const results = await statementsClient.getCashFlowStatement(symbol, {
          limit,
          period,
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
    "getLatestFinancialStatements",
    {
      page: z.number().optional().describe("Page number (default: 0)"),
      limit: z
        .number()
        .optional()
        .describe("Limit on number of results (default: 250, max: 250)"),
    },
    async ({ page, limit }) => {
      try {
        const results = await statementsClient.getLatestFinancialStatements({
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
    "getIncomeStatementTTM",
    {
      symbol: z.string().describe("Stock symbol"),
      limit: z
        .number()
        .optional()
        .describe("Limit on number of results (default: 100, max: 1000)"),
    },
    async ({ symbol, limit }) => {
      try {
        const results = await statementsClient.getIncomeStatementTTM(symbol, {
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
    "getBalanceSheetStatementTTM",
    {
      symbol: z.string().describe("Stock symbol"),
      limit: z
        .number()
        .optional()
        .describe("Limit on number of results (default: 100, max: 1000)"),
    },
    async ({ symbol, limit }) => {
      try {
        const results = await statementsClient.getBalanceSheetStatementTTM(
          symbol,
          { limit }
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
    "getCashFlowStatementTTM",
    {
      symbol: z.string().describe("Stock symbol"),
      limit: z
        .number()
        .optional()
        .describe("Limit on number of results (default: 100, max: 1000)"),
    },
    async ({ symbol, limit }) => {
      try {
        const results = await statementsClient.getCashFlowStatementTTM(symbol, {
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
    "getIncomeStatementGrowth",
    {
      symbol: z.string().describe("Stock symbol"),
      limit: z
        .number()
        .optional()
        .describe("Limit on number of results (default: 100, max: 1000)"),
      period: z
        .enum(["Q1", "Q2", "Q3", "Q4", "FY"])
        .optional()
        .describe("Period (Q1, Q2, Q3, Q4, or FY)"),
    },
    async ({ symbol, limit, period }) => {
      try {
        const results = await statementsClient.getIncomeStatementGrowth(
          symbol,
          {
            limit,
            period,
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
    "getBalanceSheetStatementGrowth",
    {
      symbol: z.string().describe("Stock symbol"),
      limit: z
        .number()
        .optional()
        .describe("Limit on number of results (default: 100, max: 1000)"),
      period: z
        .enum(["Q1", "Q2", "Q3", "Q4", "FY"])
        .optional()
        .describe("Period (Q1, Q2, Q3, Q4, or FY)"),
    },
    async ({ symbol, limit, period }) => {
      try {
        const results = await statementsClient.getBalanceSheetStatementGrowth(
          symbol,
          { limit, period }
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
    "getCashFlowStatementGrowth",
    {
      symbol: z.string().describe("Stock symbol"),
      limit: z
        .number()
        .optional()
        .describe("Limit on number of results (default: 100, max: 1000)"),
      period: z
        .enum(["Q1", "Q2", "Q3", "Q4", "FY"])
        .optional()
        .describe("Period (Q1, Q2, Q3, Q4, or FY)"),
    },
    async ({ symbol, limit, period }) => {
      try {
        const results = await statementsClient.getCashFlowStatementGrowth(
          symbol,
          { limit, period }
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
    "getFinancialStatementGrowth",
    {
      symbol: z.string().describe("Stock symbol"),
      limit: z
        .number()
        .optional()
        .describe("Limit on number of results (default: 100, max: 1000)"),
      period: z
        .enum(["Q1", "Q2", "Q3", "Q4", "FY"])
        .optional()
        .describe("Period (Q1, Q2, Q3, Q4, or FY)"),
    },
    async ({ symbol, limit, period }) => {
      try {
        const results = await statementsClient.getFinancialStatementGrowth(
          symbol,
          { limit, period }
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
    "getFinancialReportsDates",
    {
      symbol: z.string().describe("Stock symbol"),
    },
    async ({ symbol }) => {
      try {
        const results = await statementsClient.getFinancialReportsDates(symbol);
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
    "getFinancialReportJSON",
    {
      symbol: z.string().describe("Stock symbol"),
      year: z.number().describe("Year of the report"),
      period: z
        .enum(["Q1", "Q2", "Q3", "Q4", "FY"])
        .describe("Period (Q1, Q2, Q3, Q4, or FY)"),
    },
    async ({ symbol, year, period }) => {
      try {
        const results = await statementsClient.getFinancialReportJSON(
          symbol,
          year,
          period
        );
        return {
          content: [{ type: "text", text: JSON.stringify(results, null, 2) }],
        };
      } catch (error) {
        console.error("Error fetching financial report JSON:", error);
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
    "getFinancialReportXLSX",
    {
      symbol: z.string().describe("Stock symbol"),
      year: z.number().describe("Year of the report"),
      period: z
        .enum(["Q1", "Q2", "Q3", "Q4", "FY"])
        .describe("Period (Q1, Q2, Q3, Q4, or FY)"),
    },
    async ({ symbol, year, period }) => {
      try {
        const results = await statementsClient.getFinancialReportXLSX(
          symbol,
          year,
          period
        );
        return {
          content: [{ type: "text", text: JSON.stringify(results, null, 2) }],
        };
      } catch (error) {
        console.error("Error fetching financial report XLSX:", error);
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
    "getRevenueProductSegmentation",
    {
      symbol: z.string().describe("Stock symbol"),
      period: z
        .enum(["annual", "quarter"])
        .optional()
        .describe("Period type (annual or quarter)"),
      structure: z.enum(["flat"]).optional().describe("Response structure"),
    },
    async ({ symbol, period, structure }) => {
      try {
        const results = await statementsClient.getRevenueProductSegmentation(
          symbol,
          { period, structure }
        );
        return {
          content: [{ type: "text", text: JSON.stringify(results, null, 2) }],
        };
      } catch (error) {
        console.error("Error fetching revenue product segmentation:", error);
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
    "getRevenueGeographicSegmentation",
    {
      symbol: z.string().describe("Stock symbol"),
      period: z
        .enum(["annual", "quarter"])
        .optional()
        .describe("Period type (annual or quarter)"),
      structure: z.enum(["flat"]).optional().describe("Response structure"),
    },
    async ({ symbol, period, structure }) => {
      try {
        const results = await statementsClient.getRevenueGeographicSegmentation(
          symbol,
          { period, structure }
        );
        return {
          content: [{ type: "text", text: JSON.stringify(results, null, 2) }],
        };
      } catch (error) {
        console.error("Error fetching revenue geographic segmentation:", error);
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
    "getIncomeStatementAsReported",
    {
      symbol: z.string().describe("Stock symbol"),
      limit: z
        .number()
        .optional()
        .describe("Limit on number of results (default: 100, max: 1000)"),
      period: z
        .enum(["annual", "quarter"])
        .optional()
        .describe("Period type (annual or quarter)"),
    },
    async ({ symbol, limit, period }) => {
      try {
        const results = await statementsClient.getIncomeStatementAsReported(
          symbol,
          { limit, period }
        );
        return {
          content: [{ type: "text", text: JSON.stringify(results, null, 2) }],
        };
      } catch (error) {
        console.error("Error fetching income statement as reported:", error);
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
    "getBalanceSheetStatementAsReported",
    {
      symbol: z.string().describe("Stock symbol"),
      limit: z
        .number()
        .optional()
        .describe("Limit on number of results (default: 100, max: 1000)"),
      period: z
        .enum(["annual", "quarter"])
        .optional()
        .describe("Period type (annual or quarter)"),
    },
    async ({ symbol, limit, period }) => {
      try {
        const results =
          await statementsClient.getBalanceSheetStatementAsReported(symbol, {
            limit,
            period,
          });
        return {
          content: [{ type: "text", text: JSON.stringify(results, null, 2) }],
        };
      } catch (error) {
        console.error(
          "Error fetching balance sheet statement as reported:",
          error
        );
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
    "getCashFlowStatementAsReported",
    {
      symbol: z.string().describe("Stock symbol"),
      limit: z
        .number()
        .optional()
        .describe("Limit on number of results (default: 100, max: 1000)"),
      period: z
        .enum(["annual", "quarter"])
        .optional()
        .describe("Period type (annual or quarter)"),
    },
    async ({ symbol, limit, period }) => {
      try {
        const results = await statementsClient.getCashFlowStatementAsReported(
          symbol,
          { limit, period }
        );
        return {
          content: [{ type: "text", text: JSON.stringify(results, null, 2) }],
        };
      } catch (error) {
        console.error("Error fetching cash flow statement as reported:", error);
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
    "getFinancialStatementFullAsReported",
    {
      symbol: z.string().describe("Stock symbol"),
      limit: z
        .number()
        .optional()
        .describe("Limit on number of results (default: 100, max: 1000)"),
      period: z
        .enum(["annual", "quarter"])
        .optional()
        .describe("Period type (annual or quarter)"),
    },
    async ({ symbol, limit, period }) => {
      try {
        const results =
          await statementsClient.getFinancialStatementFullAsReported(symbol, {
            limit,
            period,
          });
        return {
          content: [{ type: "text", text: JSON.stringify(results, null, 2) }],
        };
      } catch (error) {
        console.error(
          "Error fetching full financial statement as reported:",
          error
        );
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
