import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { CalendarClient } from "../api/calendar/CalendarClient.js";

/**
 * Register all calendar-related tools with the MCP server
 * @param server The MCP server instance
 * @param accessToken The Financial Modeling Prep API access token
 */
export function registerCalendarTools(
  server: McpServer,
  accessToken: string
): void {
  const calendarClient = new CalendarClient(accessToken);

  server.tool(
    "getDividends",
    {
      symbol: z.string().describe("Stock symbol"),
      limit: z
        .number()
        .optional()
        .describe(
          "Optional limit on number of results (default: 100, max: 1000)"
        ),
    },
    async ({ symbol, limit }) => {
      try {
        const results = await calendarClient.getDividends(symbol, limit);
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
    "getDividendsCalendar",
    {
      from: z.string().describe("Start date (YYYY-MM-DD)"),
      to: z.string().describe("End date (YYYY-MM-DD)"),
    },
    async ({ from, to }) => {
      try {
        const results = await calendarClient.getDividendsCalendar(from, to);
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
    "getEarningsReports",
    {
      symbol: z.string().describe("Stock symbol"),
      limit: z
        .number()
        .optional()
        .describe(
          "Optional limit on number of results (default: 100, max: 1000)"
        ),
    },
    async ({ symbol, limit }) => {
      try {
        const results = await calendarClient.getEarningsReports(symbol, limit);
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
    "getEarningsCalendar",
    {
      from: z.string().describe("Start date (YYYY-MM-DD)"),
      to: z.string().describe("End date (YYYY-MM-DD)"),
    },
    async ({ from, to }) => {
      try {
        const results = await calendarClient.getEarningsCalendar(from, to);
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
    "getIPOCalendar",
    {
      from: z.string().describe("Start date (YYYY-MM-DD)"),
      to: z.string().describe("End date (YYYY-MM-DD)"),
    },
    async ({ from, to }) => {
      try {
        const results = await calendarClient.getIPOCalendar(from, to);
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
    "getIPODisclosures",
    {
      from: z.string().describe("Start date (YYYY-MM-DD)"),
      to: z.string().describe("End date (YYYY-MM-DD)"),
    },
    async ({ from, to }) => {
      try {
        const results = await calendarClient.getIPODisclosures(from, to);
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
    "getIPOProspectuses",
    {
      from: z.string().describe("Start date (YYYY-MM-DD)"),
      to: z.string().describe("End date (YYYY-MM-DD)"),
    },
    async ({ from, to }) => {
      try {
        const results = await calendarClient.getIPOProspectuses(from, to);
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
    "getStockSplits",
    {
      symbol: z.string().describe("Stock symbol"),
      limit: z
        .number()
        .optional()
        .describe(
          "Optional limit on number of results (default: 100, max: 1000)"
        ),
    },
    async ({ symbol, limit }) => {
      try {
        const results = await calendarClient.getStockSplits(symbol, limit);
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
    "getStockSplitsCalendar",
    {
      from: z.string().describe("Start date (YYYY-MM-DD)"),
      to: z.string().describe("End date (YYYY-MM-DD)"),
    },
    async ({ from, to }) => {
      try {
        const results = await calendarClient.getStockSplitsCalendar(from, to);
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
