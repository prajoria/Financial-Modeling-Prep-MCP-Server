#!/usr/bin/env node

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { SearchClient } from "./api/search/SearchClient.js";
import { DirectoryClient } from "./api/directory/DirectoryClient.js";
import { AnalystClient } from "./api/analyst/AnalystClient.js";
import { CalendarClient } from "./api/calendar/CalendarClient.js";
import minimist from "minimist";

// Import manually specified version instead of from package.json
const VERSION = "1.0.0";

// Parse command line arguments
const argv = minimist(process.argv.slice(2));
const accessToken = argv["fmp-token"] || process.env.FMP_ACCESS_TOKEN;

// Validate access token
if (!accessToken) {
  console.error(
    "Error: Financial Modeling Prep access token is required. Provide it with --fmp-token or FMP_ACCESS_TOKEN environment variable."
  );
  process.exit(1);
}

const server = new McpServer({
  name: "Financial Modeling Prep MCP",
  version: VERSION,
});

// Initialize the search client
const searchClient = new SearchClient(accessToken);

// Initialize the directory client
const directoryClient = new DirectoryClient(accessToken);

// Initialize the analyst client
const analystClient = new AnalystClient(accessToken);

// Initialize the calendar client
const calendarClient = new CalendarClient(accessToken);

// Register search tools
server.tool(
  "searchSymbol",
  {
    query: z.string().describe("The search query to find stock symbols"),
    limit: z
      .number()
      .optional()
      .describe("Optional limit on number of results (default: 50)"),
    exchange: z
      .string()
      .optional()
      .describe("Optional exchange filter (e.g., NASDAQ, NYSE)"),
  },
  async ({ query, limit, exchange }) => {
    try {
      const results = await searchClient.searchSymbol(query, limit, exchange);
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
  "searchName",
  {
    query: z.string().describe("The search query to find company names"),
    limit: z
      .number()
      .optional()
      .describe("Optional limit on number of results (default: 50)"),
    exchange: z
      .string()
      .optional()
      .describe("Optional exchange filter (e.g., NASDAQ, NYSE)"),
  },
  async ({ query, limit, exchange }) => {
    try {
      const results = await searchClient.searchName(query, limit, exchange);
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
  "searchCIK",
  {
    cik: z.string().describe("The CIK number to search for"),
    limit: z
      .number()
      .optional()
      .describe("Optional limit on number of results (default: 50)"),
  },
  async ({ cik, limit }) => {
    try {
      const results = await searchClient.searchCIK(cik, limit);
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
  "searchCUSIP",
  {
    cusip: z.string().describe("The CUSIP number to search for"),
  },
  async ({ cusip }) => {
    try {
      const results = await searchClient.searchCUSIP(cusip);
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
  "searchISIN",
  {
    isin: z.string().describe("The ISIN number to search for"),
  },
  async ({ isin }) => {
    try {
      const results = await searchClient.searchISIN(isin);
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
  "stockScreener",
  {
    marketCapMoreThan: z
      .number()
      .optional()
      .describe("Filter companies with market cap greater than this value"),
    marketCapLowerThan: z
      .number()
      .optional()
      .describe("Filter companies with market cap less than this value"),
    sector: z
      .string()
      .optional()
      .describe("Filter by sector (e.g., Technology)"),
    industry: z
      .string()
      .optional()
      .describe("Filter by industry (e.g., Consumer Electronics)"),
    betaMoreThan: z
      .number()
      .optional()
      .describe("Filter companies with beta greater than this value"),
    betaLowerThan: z
      .number()
      .optional()
      .describe("Filter companies with beta less than this value"),
    priceMoreThan: z
      .number()
      .optional()
      .describe("Filter companies with price greater than this value"),
    priceLowerThan: z
      .number()
      .optional()
      .describe("Filter companies with price less than this value"),
    dividendMoreThan: z
      .number()
      .optional()
      .describe("Filter companies with dividend greater than this value"),
    dividendLowerThan: z
      .number()
      .optional()
      .describe("Filter companies with dividend less than this value"),
    volumeMoreThan: z
      .number()
      .optional()
      .describe("Filter companies with volume greater than this value"),
    volumeLowerThan: z
      .number()
      .optional()
      .describe("Filter companies with volume less than this value"),
    exchange: z
      .string()
      .optional()
      .describe("Filter by exchange (e.g., NASDAQ)"),
    country: z.string().optional().describe("Filter by country (e.g., US)"),
    isEtf: z.boolean().optional().describe("Filter ETFs"),
    isFund: z.boolean().optional().describe("Filter funds"),
    isActivelyTrading: z
      .boolean()
      .optional()
      .describe("Filter actively trading companies"),
    limit: z.number().optional().describe("Limit number of results"),
    includeAllShareClasses: z
      .boolean()
      .optional()
      .describe("Include all share classes"),
  },
  async (params) => {
    try {
      const results = await searchClient.stockScreener(params);
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
  "searchExchangeVariants",
  {
    symbol: z
      .string()
      .describe("The stock symbol to search for exchange variants"),
  },
  async ({ symbol }) => {
    try {
      const results = await searchClient.searchExchangeVariants(symbol);
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

// Register directory tools
server.tool("getCompanySymbols", {}, async () => {
  try {
    const results = await directoryClient.getCompanySymbols();
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

server.tool("getFinancialStatementSymbols", {}, async () => {
  try {
    const results = await directoryClient.getFinancialStatementSymbols();
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
  "getCIKList",
  {
    limit: z
      .number()
      .optional()
      .describe("Optional limit on number of results (default: 1000)"),
  },
  async ({ limit }) => {
    try {
      const results = await directoryClient.getCIKList(limit);
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
  "getSymbolChanges",
  {
    invalid: z
      .boolean()
      .optional()
      .describe("Optional filter for invalid symbols (default: false)"),
    limit: z
      .number()
      .optional()
      .describe("Optional limit on number of results (default: 100)"),
  },
  async ({ invalid, limit }) => {
    try {
      const results = await directoryClient.getSymbolChanges(invalid, limit);
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

server.tool("getETFList", {}, async () => {
  try {
    const results = await directoryClient.getETFList();
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

server.tool("getActivelyTradingList", {}, async () => {
  try {
    const results = await directoryClient.getActivelyTradingList();
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

server.tool("getEarningsTranscriptList", {}, async () => {
  try {
    const results = await directoryClient.getEarningsTranscriptList();
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

server.tool("getAvailableExchanges", {}, async () => {
  try {
    const results = await directoryClient.getAvailableExchanges();
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

server.tool("getAvailableSectors", {}, async () => {
  try {
    const results = await directoryClient.getAvailableSectors();
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

server.tool("getAvailableIndustries", {}, async () => {
  try {
    const results = await directoryClient.getAvailableIndustries();
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

server.tool("getAvailableCountries", {}, async () => {
  try {
    const results = await directoryClient.getAvailableCountries();
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

// Register analyst tools
server.tool(
  "getAnalystEstimates",
  {
    symbol: z.string().describe("Stock symbol"),
    period: z
      .enum(["annual", "quarter"])
      .describe("Period (annual or quarter)"),
    page: z.number().optional().describe("Optional page number (default: 0)"),
    limit: z
      .number()
      .optional()
      .describe("Optional limit on number of results (default: 10, max: 1000)"),
  },
  async ({ symbol, period, page, limit }) => {
    try {
      const results = await analystClient.getAnalystEstimates(
        symbol,
        period,
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
  "getRatingsSnapshot",
  {
    symbol: z.string().describe("Stock symbol"),
    limit: z
      .number()
      .optional()
      .describe("Optional limit on number of results (default: 1)"),
  },
  async ({ symbol, limit }) => {
    try {
      const results = await analystClient.getRatingsSnapshot(symbol, limit);
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
  "getHistoricalRatings",
  {
    symbol: z.string().describe("Stock symbol"),
    limit: z
      .number()
      .optional()
      .describe("Optional limit on number of results (default: 1, max: 10000)"),
  },
  async ({ symbol, limit }) => {
    try {
      const results = await analystClient.getHistoricalRatings(symbol, limit);
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
  "getPriceTargetSummary",
  {
    symbol: z.string().describe("Stock symbol"),
  },
  async ({ symbol }) => {
    try {
      const results = await analystClient.getPriceTargetSummary(symbol);
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
  "getPriceTargetConsensus",
  {
    symbol: z.string().describe("Stock symbol"),
  },
  async ({ symbol }) => {
    try {
      const results = await analystClient.getPriceTargetConsensus(symbol);
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
  "getPriceTargetNews",
  {
    symbol: z.string().describe("Stock symbol"),
    page: z.number().optional().describe("Optional page number (default: 0)"),
    limit: z
      .number()
      .optional()
      .describe("Optional limit on number of results (default: 10)"),
  },
  async ({ symbol, page, limit }) => {
    try {
      const results = await analystClient.getPriceTargetNews(
        symbol,
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
  "getPriceTargetLatestNews",
  {
    page: z
      .number()
      .optional()
      .describe("Optional page number (default: 0, max: 100)"),
    limit: z
      .number()
      .optional()
      .describe("Optional limit on number of results (default: 10, max: 1000)"),
  },
  async ({ page, limit }) => {
    try {
      const results = await analystClient.getPriceTargetLatestNews(page, limit);
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
  "getStockGrades",
  {
    symbol: z.string().describe("Stock symbol"),
  },
  async ({ symbol }) => {
    try {
      const results = await analystClient.getStockGrades(symbol);
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
  "getHistoricalStockGrades",
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
      const results = await analystClient.getHistoricalStockGrades(
        symbol,
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
  "getStockGradeSummary",
  {
    symbol: z.string().describe("Stock symbol"),
  },
  async ({ symbol }) => {
    try {
      const results = await analystClient.getStockGradeSummary(symbol);
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
  "getStockGradeNews",
  {
    symbol: z.string().describe("Stock symbol"),
    page: z.number().optional().describe("Optional page number (default: 0)"),
    limit: z
      .number()
      .optional()
      .describe("Optional limit on number of results (default: 1, max: 100)"),
  },
  async ({ symbol, page, limit }) => {
    try {
      const results = await analystClient.getStockGradeNews(
        symbol,
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
  "getStockGradeLatestNews",
  {
    page: z
      .number()
      .optional()
      .describe("Optional page number (default: 0, max: 100)"),
    limit: z
      .number()
      .optional()
      .describe("Optional limit on number of results (default: 10, max: 1000)"),
  },
  async ({ page, limit }) => {
    try {
      const results = await analystClient.getStockGradeLatestNews(page, limit);
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

// Register calendar tools
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

// Log successful initialization
console.log(
  "Financial Modeling Prep MCP initialized successfully with provided token"
);

// Create a StdioServerTransport and connect to it
const transport = new StdioServerTransport();
server.connect(transport).catch((error) => {
  console.error("Failed to connect to transport:", error);
  process.exit(1);
});
