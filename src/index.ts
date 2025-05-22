#!/usr/bin/env node

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { SearchClient } from "./api/search/SearchClient.js";
import { DirectoryClient } from "./api/directory/DirectoryClient.js";
import { AnalystClient } from "./api/analyst/AnalystClient.js";
import { CalendarClient } from "./api/calendar/CalendarClient.js";
import { ChartClient } from "./api/chart/ChartClient.js";
import { CompanyClient } from "./api/company/CompanyClient.js";
import { COTClient } from "./api/cot/COTClient.js";
import { ESGClient } from "./api/esg/ESGClient.js";
import { EconomicsClient } from "./api/economics/EconomicsClient.js";
import { DCFClient } from "./api/dcf/DCFClient.js";
import { FundClient } from "./api/fund/FundClient.js";
import { CommodityClient } from "./api/commodity/CommodityClient.js";
import { FundraisersClient } from "./api/fundraisers/FundraisersClient.js";
import { CryptoClient } from "./api/crypto/CryptoClient.js";
import { ForexClient } from "./api/forex/ForexClient.js";
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

// Initialize the chart client
const chartClient = new ChartClient(accessToken);

// Initialize the company client
const companyClient = new CompanyClient(accessToken);

// Initialize the COT(Commitment Of Traders) client
const cotClient = new COTClient(accessToken);

// Initialize the ESG client
const esgClient = new ESGClient(accessToken);

// Initialize the economics client
const economicsClient = new EconomicsClient(accessToken);

// Initialize the DCF(Discounted Cash Flow) client
const dcfClient = new DCFClient(accessToken);

// Initialize the fund(ETF and Mutual Funds) client
const fundClient = new FundClient(accessToken);

// Initialize the commodity client
const commodityClient = new CommodityClient(accessToken);

// Initialize the fundraisers client
const fundraiserClient = new FundraisersClient(accessToken);

// Initialize the crypto client
const cryptoClient = new CryptoClient(accessToken);

// Initialize the forex client
const forexClient = new ForexClient(accessToken);

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

// Register chart tools
server.tool(
  "getLightChart",
  {
    symbol: z.string().describe("Stock symbol"),
  },
  async ({ symbol }) => {
    try {
      const results = await chartClient.getLightChart(symbol);
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
  "getFullChart",
  {
    symbol: z.string().describe("Stock symbol"),
  },
  async ({ symbol }) => {
    try {
      const results = await chartClient.getFullChart(symbol);
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
  "getUnadjustedChart",
  {
    symbol: z.string().describe("Stock symbol"),
  },
  async ({ symbol }) => {
    try {
      const results = await chartClient.getUnadjustedChart(symbol);
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
  "getDividendAdjustedChart",
  {
    symbol: z.string().describe("Stock symbol"),
  },
  async ({ symbol }) => {
    try {
      const results = await chartClient.getDividendAdjustedChart(symbol);
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
  "getIntradayChart",
  {
    symbol: z.string().describe("Stock symbol"),
    interval: z
      .enum(["1min", "5min", "15min", "30min", "1hour", "4hour"])
      .describe("Time interval"),
  },
  async ({ symbol, interval }) => {
    try {
      const results = await chartClient.getIntradayChart(symbol, interval);
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

// Register company tools
server.tool(
  "getCompanyProfile",
  {
    symbol: z.string().describe("Stock symbol"),
  },
  async ({ symbol }) => {
    try {
      const results = await companyClient.getProfile(symbol);
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
  "getCompanyProfileByCIK",
  {
    cik: z.string().describe("CIK number"),
  },
  async ({ cik }) => {
    try {
      const results = await companyClient.getProfileByCIK(cik);
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
  "getCompanyNotes",
  {
    symbol: z.string().describe("Stock symbol"),
  },
  async ({ symbol }) => {
    try {
      const results = await companyClient.getNotes(symbol);
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
  "getStockPeers",
  {
    symbol: z.string().describe("Stock symbol"),
  },
  async ({ symbol }) => {
    try {
      const results = await companyClient.getPeers(symbol);
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
  "getDelistedCompanies",
  {
    page: z.number().optional().describe("Page number (default: 0)"),
    limit: z
      .number()
      .optional()
      .describe("Limit on number of results (default: 100, max: 100)"),
  },
  async ({ page, limit }) => {
    try {
      const results = await companyClient.getDelistedCompanies(page, limit);
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
  "getEmployeeCount",
  {
    symbol: z.string().describe("Stock symbol"),
    limit: z
      .number()
      .optional()
      .describe("Limit on number of results (default: 100, max: 10000)"),
  },
  async ({ symbol, limit }) => {
    try {
      const results = await companyClient.getEmployeeCount(symbol, limit);
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
  "getHistoricalEmployeeCount",
  {
    symbol: z.string().describe("Stock symbol"),
    limit: z
      .number()
      .optional()
      .describe("Limit on number of results (default: 100, max: 10000)"),
  },
  async ({ symbol, limit }) => {
    try {
      const results = await companyClient.getHistoricalEmployeeCount(
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
  "getMarketCap",
  {
    symbol: z.string().describe("Stock symbol"),
  },
  async ({ symbol }) => {
    try {
      const results = await companyClient.getMarketCap(symbol);
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
  "getBatchMarketCap",
  {
    symbols: z.string().describe("Comma-separated list of stock symbols"),
  },
  async ({ symbols }) => {
    try {
      const results = await companyClient.getBatchMarketCap(symbols);
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
  "getHistoricalMarketCap",
  {
    symbol: z.string().describe("Stock symbol"),
    limit: z
      .number()
      .optional()
      .describe("Limit on number of results (default: 100, max: 5000)"),
    from: z.string().optional().describe("Start date (YYYY-MM-DD)"),
    to: z.string().optional().describe("End date (YYYY-MM-DD)"),
  },
  async ({ symbol, limit, from, to }) => {
    try {
      const results = await companyClient.getHistoricalMarketCap(
        symbol,
        limit,
        from,
        to
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
  "getShareFloat",
  {
    symbol: z.string().describe("Stock symbol"),
  },
  async ({ symbol }) => {
    try {
      const results = await companyClient.getShareFloat(symbol);
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
  "getAllShareFloat",
  {
    page: z.number().optional().describe("Page number (default: 0)"),
    limit: z
      .number()
      .optional()
      .describe("Limit on number of results (default: 1000, max: 5000)"),
  },
  async ({ page, limit }) => {
    try {
      const results = await companyClient.getAllShareFloat(page, limit);
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
  "getLatestMergersAcquisitions",
  {
    page: z.number().optional().describe("Page number (default: 0)"),
    limit: z
      .number()
      .optional()
      .describe("Limit on number of results (default: 100, max: 1000)"),
  },
  async ({ page, limit }) => {
    try {
      const results = await companyClient.getLatestMergersAcquisitions(
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
  "searchMergersAcquisitions",
  {
    name: z.string().describe("Company name to search for"),
  },
  async ({ name }) => {
    try {
      const results = await companyClient.searchMergersAcquisitions(name);
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
  "getCompanyExecutives",
  {
    symbol: z.string().describe("Stock symbol"),
    active: z.string().optional().describe("Filter for active executives"),
  },
  async ({ symbol, active }) => {
    try {
      const results = await companyClient.getExecutives(symbol, active);
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
  "getExecutiveCompensation",
  {
    symbol: z.string().describe("Stock symbol"),
  },
  async ({ symbol }) => {
    try {
      const results = await companyClient.getExecutiveCompensation(symbol);
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
  "getExecutiveCompensationBenchmark",
  {
    year: z.string().optional().describe("Year to get benchmark data for"),
  },
  async ({ year }) => {
    try {
      const results = await companyClient.getExecutiveCompensationBenchmark(
        year
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

// Register COT(Commitment Of Traders) tools
server.tool(
  "getCOTReports",
  {
    symbol: z.string().describe("Commodity symbol"),
    limit: z
      .number()
      .optional()
      .describe("Optional limit on number of results"),
  },
  async ({ symbol, limit }) => {
    try {
      const results = await cotClient.getReports(symbol, limit);
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
  "getCOTAnalysis",
  {
    symbol: z.string().describe("Commodity symbol"),
    limit: z
      .number()
      .optional()
      .describe("Optional limit on number of results"),
  },
  async ({ symbol, limit }) => {
    try {
      const results = await cotClient.getAnalysis(symbol, limit);
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

server.tool("getCOTList", {}, async () => {
  try {
    const results = await cotClient.getList();
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

// Register ESG tools
server.tool(
  "getESGDisclosures",
  {
    symbol: z.string().describe("Stock symbol"),
    limit: z
      .number()
      .optional()
      .describe("Optional limit on number of results"),
  },
  async ({ symbol, limit }) => {
    try {
      const results = await esgClient.getDisclosures(symbol, limit);
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
  "getESGRatings",
  {
    symbol: z.string().describe("Stock symbol"),
  },
  async ({ symbol }) => {
    try {
      const results = await esgClient.getRatings(symbol);
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
  "getESGBenchmarks",
  {
    sector: z.string().describe("Sector to get benchmarks for"),
    year: z.string().optional().describe("Optional year to get benchmarks for"),
  },
  async ({ sector, year }) => {
    try {
      const results = await esgClient.getBenchmarks(sector, year);
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

// Register Economics tools
server.tool(
  "getTreasuryRates",
  {
    limit: z
      .number()
      .optional()
      .describe("Optional limit on number of results"),
  },
  async ({ limit }) => {
    try {
      const results = await economicsClient.getTreasuryRates(limit);
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
  "getEconomicIndicators",
  {
    indicator: z
      .string()
      .optional()
      .describe("Optional specific indicator to get"),
    limit: z
      .number()
      .optional()
      .describe("Optional limit on number of results"),
  },
  async ({ indicator, limit }) => {
    try {
      const results = await economicsClient.getEconomicIndicators(
        indicator,
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
  "getEconomicCalendar",
  {
    from: z.string().describe("Start date (YYYY-MM-DD)"),
    to: z.string().describe("End date (YYYY-MM-DD)"),
  },
  async ({ from, to }) => {
    try {
      const results = await economicsClient.getEconomicCalendar(from, to);
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
  "getMarketRiskPremium",
  {
    limit: z
      .number()
      .optional()
      .describe("Optional limit on number of results"),
  },
  async ({ limit }) => {
    try {
      const results = await economicsClient.getMarketRiskPremium(limit);
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

// Register DCF(Discounted Cash Flow) tools
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

// Register Fund(ETF and Mutual Funds) tools
server.tool(
  "getFundHoldings",
  {
    symbol: z.string().describe("Fund symbol"),
    limit: z
      .number()
      .optional()
      .describe("Optional limit on number of results"),
  },
  async ({ symbol, limit }) => {
    try {
      const results = await fundClient.getHoldings(symbol, limit);
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
  "getFundInfo",
  {
    symbol: z.string().describe("Fund symbol"),
  },
  async ({ symbol }) => {
    try {
      const results = await fundClient.getInfo(symbol);
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
  "getFundCountryAllocation",
  {
    symbol: z.string().describe("Fund symbol"),
  },
  async ({ symbol }) => {
    try {
      const results = await fundClient.getCountryAllocation(symbol);
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
  "getFundAssetExposure",
  {
    symbol: z.string().describe("Fund symbol"),
  },
  async ({ symbol }) => {
    try {
      const results = await fundClient.getAssetExposure(symbol);
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
  "getFundSectorWeighting",
  {
    symbol: z.string().describe("Fund symbol"),
  },
  async ({ symbol }) => {
    try {
      const results = await fundClient.getSectorWeighting(symbol);
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
  "getFundDisclosure",
  {
    symbol: z.string().describe("Fund symbol"),
    limit: z
      .number()
      .optional()
      .describe("Optional limit on number of results"),
  },
  async ({ symbol, limit }) => {
    try {
      const results = await fundClient.getDisclosure(symbol, limit);
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
  "searchFundDisclosures",
  {
    query: z.string().describe("Search query"),
    limit: z
      .number()
      .optional()
      .describe("Optional limit on number of results"),
  },
  async ({ query, limit }) => {
    try {
      const results = await fundClient.searchDisclosures(query, limit);
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
  "getFundDisclosureDates",
  {
    symbol: z.string().describe("Fund symbol"),
  },
  async ({ symbol }) => {
    try {
      const results = await fundClient.getDisclosureDates(symbol);
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

// Register Commodity tools
server.tool(
  "getCommodityPrice",
  {
    symbol: z.string().describe("Commodity symbol"),
  },
  async ({ symbol }) => {
    try {
      const results = await commodityClient.getPrice(symbol);
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
  "getCommodityHistoricalPrices",
  {
    symbol: z.string().describe("Commodity symbol"),
    limit: z
      .number()
      .optional()
      .describe("Optional limit on number of results"),
  },
  async ({ symbol, limit }) => {
    try {
      const results = await commodityClient.getHistoricalPrices(symbol, limit);
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
  "getCommodityQuote",
  {
    symbol: z.string().describe("Commodity symbol"),
  },
  async ({ symbol }) => {
    try {
      const results = await commodityClient.getQuote(symbol);
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
  "getCommodityContract",
  {
    symbol: z.string().describe("Commodity symbol"),
  },
  async ({ symbol }) => {
    try {
      const results = await commodityClient.getContract(symbol);
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
  "getCommodityMarketData",
  {
    symbol: z.string().describe("Commodity symbol"),
  },
  async ({ symbol }) => {
    try {
      const results = await commodityClient.getMarketData(symbol);
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
  "getCommodityNews",
  {
    symbol: z.string().describe("Commodity symbol"),
    limit: z
      .number()
      .optional()
      .describe("Optional limit on number of results"),
  },
  async ({ symbol, limit }) => {
    try {
      const results = await commodityClient.getNews(symbol, limit);
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
  "getCommodityForecast",
  {
    symbol: z.string().describe("Commodity symbol"),
  },
  async ({ symbol }) => {
    try {
      const results = await commodityClient.getForecast(symbol);
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
  "getCommoditySupplyDemand",
  {
    symbol: z.string().describe("Commodity symbol"),
  },
  async ({ symbol }) => {
    try {
      const results = await commodityClient.getSupplyDemand(symbol);
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

// Register Fundraisers tools
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
      const results = await fundraiserClient.getLatestCrowdfundingCampaigns(
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
      const results = await fundraiserClient.searchCrowdfundingCampaigns(name);
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
      const results = await fundraiserClient.getCrowdfundingCampaignsByCIK(cik);
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
      .describe("Limit on number of results (default: 100, max: 1000)"),
    cik: z.string().optional().describe("Optional CIK number to filter by"),
  },
  async ({ page, limit, cik }) => {
    try {
      const results = await fundraiserClient.getLatestEquityOfferings(
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
      const results = await fundraiserClient.searchEquityOfferings(name);
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
      const results = await fundraiserClient.getEquityOfferingsByCIK(cik);
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

// Register Crypto tools
server.tool("getCryptocurrencyList", {}, async () => {
  try {
    const results = await cryptoClient.getList();
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
  "getCryptocurrencyQuote",
  {
    symbol: z.string().describe("Cryptocurrency symbol (e.g., BTCUSD)"),
  },
  async ({ symbol }) => {
    try {
      const results = await cryptoClient.getQuote(symbol);
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
  "getCryptocurrencyShortQuote",
  {
    symbol: z.string().describe("Cryptocurrency symbol (e.g., BTCUSD)"),
  },
  async ({ symbol }) => {
    try {
      const results = await cryptoClient.getShortQuote(symbol);
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

server.tool("getCryptocurrencyBatchQuotes", {}, async () => {
  try {
    const results = await cryptoClient.getBatchQuotes();
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
  "getCryptocurrencyHistoricalLightChart",
  {
    symbol: z.string().describe("Cryptocurrency symbol (e.g., BTCUSD)"),
    from: z.string().optional().describe("Start date (YYYY-MM-DD)"),
    to: z.string().optional().describe("End date (YYYY-MM-DD)"),
  },
  async ({ symbol, from, to }) => {
    try {
      const results = await cryptoClient.getHistoricalLightChart(
        symbol,
        from,
        to
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
  "getCryptocurrencyHistoricalFullChart",
  {
    symbol: z.string().describe("Cryptocurrency symbol (e.g., BTCUSD)"),
    from: z.string().optional().describe("Start date (YYYY-MM-DD)"),
    to: z.string().optional().describe("End date (YYYY-MM-DD)"),
  },
  async ({ symbol, from, to }) => {
    try {
      const results = await cryptoClient.getHistoricalFullChart(
        symbol,
        from,
        to
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
  "getCryptocurrency1MinuteData",
  {
    symbol: z.string().describe("Cryptocurrency symbol (e.g., BTCUSD)"),
    from: z.string().optional().describe("Start date (YYYY-MM-DD)"),
    to: z.string().optional().describe("End date (YYYY-MM-DD)"),
  },
  async ({ symbol, from, to }) => {
    try {
      const results = await cryptoClient.get1MinuteData(symbol, from, to);
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
  "getCryptocurrency5MinuteData",
  {
    symbol: z.string().describe("Cryptocurrency symbol (e.g., BTCUSD)"),
    from: z.string().optional().describe("Start date (YYYY-MM-DD)"),
    to: z.string().optional().describe("End date (YYYY-MM-DD)"),
  },
  async ({ symbol, from, to }) => {
    try {
      const results = await cryptoClient.get5MinuteData(symbol, from, to);
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
  "getCryptocurrency1HourData",
  {
    symbol: z.string().describe("Cryptocurrency symbol (e.g., BTCUSD)"),
    from: z.string().optional().describe("Start date (YYYY-MM-DD)"),
    to: z.string().optional().describe("End date (YYYY-MM-DD)"),
  },
  async ({ symbol, from, to }) => {
    try {
      const results = await cryptoClient.get1HourData(symbol, from, to);
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

// Register Forex tools
server.tool("getForexList", {}, async () => {
  try {
    const results = await forexClient.getList();
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
  "getForexQuote",
  {
    symbol: z.string().describe("Forex pair symbol (e.g., EURUSD)"),
  },
  async ({ symbol }) => {
    try {
      const results = await forexClient.getQuote(symbol);
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
  "getForexShortQuote",
  {
    symbol: z.string().describe("Forex pair symbol (e.g., EURUSD)"),
  },
  async ({ symbol }) => {
    try {
      const results = await forexClient.getShortQuote(symbol);
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

server.tool("getForexBatchQuotes", {}, async () => {
  try {
    const results = await forexClient.getBatchQuotes();
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
  "getForexHistoricalLightChart",
  {
    symbol: z.string().describe("Forex pair symbol (e.g., EURUSD)"),
    from: z.string().optional().describe("Start date (YYYY-MM-DD)"),
    to: z.string().optional().describe("End date (YYYY-MM-DD)"),
  },
  async ({ symbol, from, to }) => {
    try {
      const results = await forexClient.getHistoricalLightChart(
        symbol,
        from,
        to
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
  "getForexHistoricalFullChart",
  {
    symbol: z.string().describe("Forex pair symbol (e.g., EURUSD)"),
    from: z.string().optional().describe("Start date (YYYY-MM-DD)"),
    to: z.string().optional().describe("End date (YYYY-MM-DD)"),
  },
  async ({ symbol, from, to }) => {
    try {
      const results = await forexClient.getHistoricalFullChart(
        symbol,
        from,
        to
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
  "getForex1MinuteData",
  {
    symbol: z.string().describe("Forex pair symbol (e.g., EURUSD)"),
    from: z.string().optional().describe("Start date (YYYY-MM-DD)"),
    to: z.string().optional().describe("End date (YYYY-MM-DD)"),
  },
  async ({ symbol, from, to }) => {
    try {
      const results = await forexClient.get1MinuteData(symbol, from, to);
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
  "getForex5MinuteData",
  {
    symbol: z.string().describe("Forex pair symbol (e.g., EURUSD)"),
    from: z.string().optional().describe("Start date (YYYY-MM-DD)"),
    to: z.string().optional().describe("End date (YYYY-MM-DD)"),
  },
  async ({ symbol, from, to }) => {
    try {
      const results = await forexClient.get5MinuteData(symbol, from, to);
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
  "getForex1HourData",
  {
    symbol: z.string().describe("Forex pair symbol (e.g., EURUSD)"),
    from: z.string().optional().describe("Start date (YYYY-MM-DD)"),
    to: z.string().optional().describe("End date (YYYY-MM-DD)"),
  },
  async ({ symbol, from, to }) => {
    try {
      const results = await forexClient.get1HourData(symbol, from, to);
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
