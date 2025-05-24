import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { IndexesClient } from "../api/indexes/IndexesClient.js";

/**
 * Register all indexes-related tools with the MCP server
 * @param server The MCP server instance
 * @param accessToken The Financial Modeling Prep API access token (optional when using lazy loading)
 */
export function registerIndexesTools(
  server: McpServer,
  accessToken?: string
): void {
  const indexesClient = new IndexesClient(accessToken);

  server.tool("getIndexList", {}, async () => {
    try {
      const results = await indexesClient.getIndexList();
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
    "getIndexQuote",
    {
      symbol: z.string().describe("Index symbol (e.g., ^GSPC for S&P 500)"),
    },
    async ({ symbol }) => {
      try {
        const results = await indexesClient.getIndexQuote(symbol);
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
    "getIndexShortQuote",
    {
      symbol: z.string().describe("Index symbol (e.g., ^GSPC for S&P 500)"),
    },
    async ({ symbol }) => {
      try {
        const results = await indexesClient.getIndexShortQuote(symbol);
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
    "getAllIndexQuotes",
    {
      short: z
        .boolean()
        .optional()
        .describe("Whether to return short quotes (default: false)"),
    },
    async ({ short }) => {
      try {
        const results = await indexesClient.getAllIndexQuotes(short);
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
    "getHistoricalIndexLightChart",
    {
      symbol: z.string().describe("Index symbol (e.g., ^GSPC for S&P 500)"),
      from: z.string().optional().describe("Start date (YYYY-MM-DD)"),
      to: z.string().optional().describe("End date (YYYY-MM-DD)"),
    },
    async ({ symbol, from, to }) => {
      try {
        const results = await indexesClient.getHistoricalIndexLightChart(
          symbol,
          {
            from,
            to,
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
    "getHistoricalIndexFullChart",
    {
      symbol: z.string().describe("Index symbol (e.g., ^GSPC for S&P 500)"),
      from: z.string().optional().describe("Start date (YYYY-MM-DD)"),
      to: z.string().optional().describe("End date (YYYY-MM-DD)"),
    },
    async ({ symbol, from, to }) => {
      try {
        const results = await indexesClient.getHistoricalIndexFullChart(
          symbol,
          {
            from,
            to,
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
    "getIndex1MinuteData",
    {
      symbol: z.string().describe("Index symbol (e.g., ^GSPC for S&P 500)"),
      from: z.string().optional().describe("Start date (YYYY-MM-DD)"),
      to: z.string().optional().describe("End date (YYYY-MM-DD)"),
    },
    async ({ symbol, from, to }) => {
      try {
        const results = await indexesClient.getIndex1MinuteData(symbol, {
          from,
          to,
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
    "getIndex5MinuteData",
    {
      symbol: z.string().describe("Index symbol (e.g., ^GSPC for S&P 500)"),
      from: z.string().optional().describe("Start date (YYYY-MM-DD)"),
      to: z.string().optional().describe("End date (YYYY-MM-DD)"),
    },
    async ({ symbol, from, to }) => {
      try {
        const results = await indexesClient.getIndex5MinuteData(symbol, {
          from,
          to,
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
    "getIndex1HourData",
    {
      symbol: z.string().describe("Index symbol (e.g., ^GSPC for S&P 500)"),
      from: z.string().optional().describe("Start date (YYYY-MM-DD)"),
      to: z.string().optional().describe("End date (YYYY-MM-DD)"),
    },
    async ({ symbol, from, to }) => {
      try {
        const results = await indexesClient.getIndex1HourData(symbol, {
          from,
          to,
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

  server.tool("getSP500Constituents", {}, async () => {
    try {
      const results = await indexesClient.getSP500Constituents();
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

  server.tool("getNasdaqConstituents", {}, async () => {
    try {
      const results = await indexesClient.getNasdaqConstituents();
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

  server.tool("getDowJonesConstituents", {}, async () => {
    try {
      const results = await indexesClient.getDowJonesConstituents();
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

  server.tool("getHistoricalSP500Changes", {}, async () => {
    try {
      const results = await indexesClient.getHistoricalSP500Changes();
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

  server.tool("getHistoricalNasdaqChanges", {}, async () => {
    try {
      const results = await indexesClient.getHistoricalNasdaqChanges();
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

  server.tool("getHistoricalDowJonesChanges", {}, async () => {
    try {
      const results = await indexesClient.getHistoricalDowJonesChanges();
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
}
