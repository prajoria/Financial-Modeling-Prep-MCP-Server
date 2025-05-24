import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { NewsClient } from "../api/news/NewsClient.js";

/**
 * Register all news-related tools with the MCP server
 * @param server The MCP server instance
 * @param accessToken The Financial Modeling Prep API access token (optional when using lazy loading)
 */
export function registerNewsTools(
  server: McpServer,
  accessToken?: string
): void {
  const newsClient = new NewsClient(accessToken);

  server.tool(
    "getFMPArticles",
    {
      page: z.number().optional().describe("Page number (default: 0)"),
      limit: z
        .number()
        .optional()
        .describe("Limit on number of results (default: 20)"),
    },
    async ({ page, limit }) => {
      try {
        const results = await newsClient.getFMPArticles({ page, limit });
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
    "getGeneralNews",
    {
      from: z.string().optional().describe("Start date (YYYY-MM-DD)"),
      to: z.string().optional().describe("End date (YYYY-MM-DD)"),
      page: z.number().optional().describe("Page number (default: 0)"),
      limit: z
        .number()
        .optional()
        .describe("Limit on number of results (default: 20, max: 250)"),
    },
    async ({ from, to, page, limit }) => {
      try {
        const results = await newsClient.getGeneralNews({
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
    "getPressReleases",
    {
      from: z.string().optional().describe("Start date (YYYY-MM-DD)"),
      to: z.string().optional().describe("End date (YYYY-MM-DD)"),
      page: z.number().optional().describe("Page number (default: 0)"),
      limit: z
        .number()
        .optional()
        .describe("Limit on number of results (default: 20, max: 250)"),
    },
    async ({ from, to, page, limit }) => {
      try {
        const results = await newsClient.getPressReleases({
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
    "getStockNews",
    {
      from: z.string().optional().describe("Start date (YYYY-MM-DD)"),
      to: z.string().optional().describe("End date (YYYY-MM-DD)"),
      page: z.number().optional().describe("Page number (default: 0)"),
      limit: z
        .number()
        .optional()
        .describe("Limit on number of results (default: 20, max: 250)"),
    },
    async ({ from, to, page, limit }) => {
      try {
        const results = await newsClient.getStockNews({
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
    "getCryptoNews",
    {
      from: z.string().optional().describe("Start date (YYYY-MM-DD)"),
      to: z.string().optional().describe("End date (YYYY-MM-DD)"),
      page: z.number().optional().describe("Page number (default: 0)"),
      limit: z
        .number()
        .optional()
        .describe("Limit on number of results (default: 20, max: 250)"),
    },
    async ({ from, to, page, limit }) => {
      try {
        const results = await newsClient.getCryptoNews({
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
    "getForexNews",
    {
      from: z.string().optional().describe("Start date (YYYY-MM-DD)"),
      to: z.string().optional().describe("End date (YYYY-MM-DD)"),
      page: z.number().optional().describe("Page number (default: 0)"),
      limit: z
        .number()
        .optional()
        .describe("Limit on number of results (default: 20, max: 250)"),
    },
    async ({ from, to, page, limit }) => {
      try {
        const results = await newsClient.getForexNews({
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
    "searchPressReleases",
    {
      symbols: z.string().describe("Comma-separated list of stock symbols"),
      from: z.string().optional().describe("Start date (YYYY-MM-DD)"),
      to: z.string().optional().describe("End date (YYYY-MM-DD)"),
      page: z.number().optional().describe("Page number (default: 0)"),
      limit: z
        .number()
        .optional()
        .describe("Limit on number of results (default: 20, max: 250)"),
    },
    async ({ symbols, from, to, page, limit }) => {
      try {
        const results = await newsClient.searchPressReleases({
          symbols,
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
    "searchStockNews",
    {
      symbols: z.string().describe("Comma-separated list of stock symbols"),
      from: z.string().optional().describe("Start date (YYYY-MM-DD)"),
      to: z.string().optional().describe("End date (YYYY-MM-DD)"),
      page: z.number().optional().describe("Page number (default: 0)"),
      limit: z
        .number()
        .optional()
        .describe("Limit on number of results (default: 20, max: 250)"),
    },
    async ({ symbols, from, to, page, limit }) => {
      try {
        const results = await newsClient.searchStockNews({
          symbols,
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
    "searchCryptoNews",
    {
      symbols: z
        .string()
        .describe("Comma-separated list of cryptocurrency symbols"),
      from: z.string().optional().describe("Start date (YYYY-MM-DD)"),
      to: z.string().optional().describe("End date (YYYY-MM-DD)"),
      page: z.number().optional().describe("Page number (default: 0)"),
      limit: z
        .number()
        .optional()
        .describe("Limit on number of results (default: 20, max: 250)"),
    },
    async ({ symbols, from, to, page, limit }) => {
      try {
        const results = await newsClient.searchCryptoNews({
          symbols,
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
    "searchForexNews",
    {
      symbols: z.string().describe("Comma-separated list of forex pairs"),
      from: z.string().optional().describe("Start date (YYYY-MM-DD)"),
      to: z.string().optional().describe("End date (YYYY-MM-DD)"),
      page: z.number().optional().describe("Page number (default: 0)"),
      limit: z
        .number()
        .optional()
        .describe("Limit on number of results (default: 20, max: 250)"),
    },
    async ({ symbols, from, to, page, limit }) => {
      try {
        const results = await newsClient.searchForexNews({
          symbols,
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
}
