import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { DCFClient } from "../api/dcf/DCFClient.js";

/**
 * Register all DCF-related tools with the MCP server
 * @param server The MCP server instance
 * @param accessToken The Financial Modeling Prep API access token (optional when using lazy loading)
 */
export function registerDCFTools(server: McpServer, accessToken?: string): void {
  const dcfClient = new DCFClient(accessToken);

  server.tool(
    "getDCFValuation",
    {
      symbol: z.string().describe("Stock symbol"),
    },
    async ({ symbol }) => {
      try {
        const results = await dcfClient.getValuation(symbol);
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
    "getLeveredDCFValuation",
    {
      symbol: z.string().describe("Stock symbol"),
    },
    async ({ symbol }) => {
      try {
        const results = await dcfClient.getLeveredValuation(symbol);
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
    "calculateCustomDCF",
    {
      input: z
        .object({
          symbol: z.string().describe("Stock symbol"),
          revenueGrowth: z.number().describe("Revenue growth rate"),
          operatingMargin: z.number().describe("Operating margin"),
          taxRate: z.number().describe("Tax rate"),
          capexToRevenue: z
            .number()
            .describe("Capital expenditure to revenue ratio"),
          workingCapitalToRevenue: z
            .number()
            .describe("Working capital to revenue ratio"),
          beta: z.number().describe("Beta"),
          marketRiskPremium: z.number().describe("Market risk premium"),
          riskFreeRate: z.number().describe("Risk-free rate"),
          terminalGrowthRate: z.number().describe("Terminal growth rate"),
          projectionYears: z.number().describe("Number of projection years"),
          includeDebt: z
            .boolean()
            .describe("Whether to include debt in calculation"),
          debtToEquity: z.number().describe("Debt to equity ratio"),
          costOfDebt: z.number().describe("Cost of debt"),
        })
        .refine(
          (data) => {
            if (data.includeDebt) {
              return (
                data.debtToEquity !== undefined && data.costOfDebt !== undefined
              );
            }
            return true;
          },
          {
            message:
              "debtToEquity and costOfDebt are required when includeDebt is true",
          }
        ),
    },
    async ({ input }) => {
      try {
        const results = await dcfClient.calculateCustomDCF(input);
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
