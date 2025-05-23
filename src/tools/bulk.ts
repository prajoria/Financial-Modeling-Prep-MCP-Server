import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { BulkClient } from "../api/bulk/BulkClient.js";

/**
 * Register all bulk data-related tools with the MCP server
 * @param server The MCP server instance
 * @param accessToken The Financial Modeling Prep API access token
 */
export function registerBulkTools(
  server: McpServer,
  accessToken: string
): void {
  const bulkClient = new BulkClient(accessToken);

  server.tool(
    "getCompanyProfilesBulk",
    {
      part: z.string().describe("Part number (e.g., 0, 1, 2)"),
    },
    async ({ part }) => {
      try {
        const results = await bulkClient.getCompanyProfilesBulk({
          part,
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

  server.tool("getStockRatingsBulk", {}, async () => {
    try {
      const results = await bulkClient.getStockRatingsBulk();
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

  server.tool("getDCFValuationsBulk", {}, async () => {
    try {
      const results = await bulkClient.getDCFValuationsBulk();
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

  server.tool("getFinancialScoresBulk", {}, async () => {
    try {
      const results = await bulkClient.getFinancialScoresBulk();
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

  server.tool("getPriceTargetSummariesBulk", {}, async () => {
    try {
      const results = await bulkClient.getPriceTargetSummariesBulk();
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
    "getETFHoldersBulk",
    {
      part: z.string().describe("Part number (e.g., 0, 1, 2)"),
    },
    async ({ part }) => {
      try {
        const results = await bulkClient.getETFHoldersBulk({
          part,
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

  server.tool("getUpgradesDowngradesConsensusBulk", {}, async () => {
    try {
      const results = await bulkClient.getUpgradesDowngradesConsensusBulk();
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

  server.tool("getKeyMetricsTTMBulk", {}, async () => {
    try {
      const results = await bulkClient.getKeyMetricsTTMBulk();
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

  server.tool("getRatiosTTMBulk", {}, async () => {
    try {
      const results = await bulkClient.getRatiosTTMBulk();
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

  server.tool("getStockPeersBulk", {}, async () => {
    try {
      const results = await bulkClient.getStockPeersBulk();
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
    "getEarningsSurprisesBulk",
    {
      year: z.string().describe("Year to get earnings surprises for"),
    },
    async ({ year }) => {
      try {
        const results = await bulkClient.getEarningsSurprisesBulk({
          year,
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
    "getIncomeStatementsBulk",
    {
      year: z.string().describe("Year (e.g., 2023)"),
      period: z.string().describe("Period (Q1, Q2, Q3, Q4, FY)"),
    },
    async ({ year, period }) => {
      try {
        const results = await bulkClient.getIncomeStatementsBulk({
          year,
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
    "getIncomeStatementGrowthBulk",
    {
      year: z.string().describe("Year (e.g., 2023)"),
      period: z.string().describe("Period (Q1, Q2, Q3, Q4, FY)"),
    },
    async ({ year, period }) => {
      try {
        const results = await bulkClient.getIncomeStatementGrowthBulk({
          year,
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
    "getBalanceSheetStatementsBulk",
    {
      year: z.string().describe("Year (e.g., 2023)"),
      period: z.string().describe("Period (Q1, Q2, Q3, Q4, FY)"),
    },
    async ({ year, period }) => {
      try {
        const results = await bulkClient.getBalanceSheetStatementsBulk({
          year,
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
    "getBalanceSheetGrowthBulk",
    {
      year: z.string().describe("Year (e.g., 2023)"),
      period: z.string().describe("Period (Q1, Q2, Q3, Q4, FY)"),
    },
    async ({ year, period }) => {
      try {
        const results = await bulkClient.getBalanceSheetGrowthBulk({
          year,
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
    "getCashFlowStatementsBulk",
    {
      year: z.string().describe("Year (e.g., 2023)"),
      period: z.string().describe("Period (Q1, Q2, Q3, Q4, FY)"),
    },
    async ({ year, period }) => {
      try {
        const results = await bulkClient.getCashFlowStatementsBulk({
          year,
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
    "getCashFlowGrowthBulk",
    {
      year: z.string().describe("Year (e.g., 2023)"),
      period: z.string().describe("Period (Q1, Q2, Q3, Q4, FY)"),
    },
    async ({ year, period }) => {
      try {
        const results = await bulkClient.getCashFlowGrowthBulk({
          year,
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
    "getEODDataBulk",
    {
      date: z.string().describe("Date in YYYY-MM-DD format"),
    },
    async ({ date }) => {
      try {
        const results = await bulkClient.getEODDataBulk({
          date,
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
