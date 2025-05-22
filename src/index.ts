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
import { StatementsClient } from "./api/statements/StatementsClient.js";
import { Form13FClient } from "./api/form-13f/Form13FClient.js";
import { IndexesClient } from "./api/indexes/IndexesClient.js";
import { InsiderTradesClient } from "./api/insider-trades/InsiderTradesClient.js";
import { MarketPerformanceClient } from "./api/market-performance/MarketPerformanceClient.js";
import { MarketHoursClient } from "./api/market-hours/MarketHoursClient.js";
import { NewsClient } from "./api/news/NewsClient.js";
import { TechnicalIndicatorsClient } from "./api/technical-indicators/TechnicalIndicatorsClient.js";
import { QuotesClient } from "./api/quotes/QuotesClient.js";
import { EarningsTranscriptClient } from "./api/earnings-transcript/EarningsTranscriptClient.js";
import { SECFilingsClient } from "./api/sec-filings/SECFilingsClient.js";
import { GovernmentTradingClient } from "./api/government-trading/GovernmentTradingClient.js";
import { BulkClient } from "./api/bulk/BulkClient.js";
import { Period } from "./api/statements/types.js";
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

// Initialize the statements client
const statementsClient = new StatementsClient(process.env.FMP_API_KEY || "");

// Initialize the form13f client
const form13fClient = new Form13FClient(accessToken);

// Initialize the indexes client
const indexesClient = new IndexesClient(accessToken);

// Initialize the insider trades client
const insiderTradesClient = new InsiderTradesClient(accessToken);

// Initialize the market performance client
const marketPerformanceClient = new MarketPerformanceClient(accessToken);

// Initialize the market hours client
const marketHoursClient = new MarketHoursClient(accessToken);

// Initialize the news client
const newsClient = new NewsClient(accessToken);

// Initialize the technical indicators client
const technicalIndicatorsClient = new TechnicalIndicatorsClient(accessToken);

// Initialize the quotes client
const quotesClient = new QuotesClient(accessToken);

// Initialize the earnings transcript client
const earningsTranscriptClient = new EarningsTranscriptClient(accessToken);

// Initialize the SEC filings client
const secFilingsClient = new SECFilingsClient(accessToken);

// Initialize the government trading client
const governmentTradingClient = new GovernmentTradingClient(accessToken);

// Initialize the bulk data client
const bulkClient = new BulkClient(accessToken);

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

// Register statements tools

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
      const results = await statementsClient.getBalanceSheetStatement(symbol, {
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
      const results = await statementsClient.getIncomeStatementGrowth(symbol, {
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
      const results = await statementsClient.getBalanceSheetStatementAsReported(
        symbol,
        { limit, period }
      );
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

// Register form13f tools
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
      const results = await form13fClient.getFilingExtract(cik, year, quarter);
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

// Register indexes tools
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
      const results = await indexesClient.getHistoricalIndexLightChart(symbol, {
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
  "getHistoricalIndexFullChart",
  {
    symbol: z.string().describe("Index symbol (e.g., ^GSPC for S&P 500)"),
    from: z.string().optional().describe("Start date (YYYY-MM-DD)"),
    to: z.string().optional().describe("End date (YYYY-MM-DD)"),
  },
  async ({ symbol, from, to }) => {
    try {
      const results = await indexesClient.getHistoricalIndexFullChart(symbol, {
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

// Register insider trades tools
server.tool(
  "getLatestInsiderTrading",
  {
    date: z.string().optional().describe("Date of insider trades (YYYY-MM-DD)"),
    page: z.number().optional().describe("Page number (default: 0)"),
    limit: z
      .number()
      .optional()
      .describe("Limit on number of results (default: 100, max: 100)"),
  },
  async ({ date, page, limit }) => {
    try {
      const results = await insiderTradesClient.getLatestInsiderTrading({
        date,
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
  "searchInsiderTrades",
  {
    symbol: z.string().optional().describe("Stock symbol"),
    page: z.number().optional().describe("Page number (default: 0)"),
    limit: z
      .number()
      .optional()
      .describe("Limit on number of results (default: 100, max: 100)"),
    reportingCik: z.string().optional().describe("Reporting CIK number"),
    companyCik: z.string().optional().describe("Company CIK number"),
    transactionType: z
      .string()
      .optional()
      .describe("Transaction type (e.g., S-Sale)"),
  },
  async ({
    symbol,
    page,
    limit,
    reportingCik,
    companyCik,
    transactionType,
  }) => {
    try {
      const results = await insiderTradesClient.searchInsiderTrades({
        symbol,
        page,
        limit,
        reportingCik,
        companyCik,
        transactionType,
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
  "searchInsiderTradesByReportingName",
  {
    name: z.string().describe("Reporting person's name to search for"),
  },
  async ({ name }) => {
    try {
      const results =
        await insiderTradesClient.searchInsiderTradesByReportingName(name);
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

server.tool("getInsiderTransactionTypes", {}, async () => {
  try {
    const results = await insiderTradesClient.getInsiderTransactionTypes();
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
  "getInsiderTradeStatistics",
  {
    symbol: z.string().describe("Stock symbol"),
  },
  async ({ symbol }) => {
    try {
      const results = await insiderTradesClient.getInsiderTradeStatistics(
        symbol
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
  "getAcquisitionOwnership",
  {
    symbol: z.string().describe("Stock symbol"),
    limit: z
      .number()
      .optional()
      .describe("Limit on number of results (default: 2000)"),
  },
  async ({ symbol, limit }) => {
    try {
      const results = await insiderTradesClient.getAcquisitionOwnership(
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

// Register market performance tools
server.tool(
  "getSectorPerformanceSnapshot",
  {
    date: z.string().describe("Date (YYYY-MM-DD)"),
    exchange: z.string().optional().describe("Exchange (e.g., NASDAQ)"),
    sector: z.string().optional().describe("Sector (e.g., Energy)"),
  },
  async ({ date, exchange, sector }) => {
    try {
      const results =
        await marketPerformanceClient.getSectorPerformanceSnapshot(date, {
          exchange,
          sector,
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
  "getIndustryPerformanceSnapshot",
  {
    date: z.string().describe("Date (YYYY-MM-DD)"),
    exchange: z.string().optional().describe("Exchange (e.g., NASDAQ)"),
    industry: z.string().optional().describe("Industry (e.g., Biotechnology)"),
  },
  async ({ date, exchange, industry }) => {
    try {
      const results =
        await marketPerformanceClient.getIndustryPerformanceSnapshot(date, {
          exchange,
          industry,
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
  "getHistoricalSectorPerformance",
  {
    sector: z.string().describe("Sector (e.g., Energy)"),
    from: z.string().optional().describe("Start date (YYYY-MM-DD)"),
    to: z.string().optional().describe("End date (YYYY-MM-DD)"),
    exchange: z.string().optional().describe("Exchange (e.g., NASDAQ)"),
  },
  async ({ sector, from, to, exchange }) => {
    try {
      const results =
        await marketPerformanceClient.getHistoricalSectorPerformance(sector, {
          from,
          to,
          exchange,
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
  "getHistoricalIndustryPerformance",
  {
    industry: z.string().describe("Industry (e.g., Biotechnology)"),
    from: z.string().optional().describe("Start date (YYYY-MM-DD)"),
    to: z.string().optional().describe("End date (YYYY-MM-DD)"),
    exchange: z.string().optional().describe("Exchange (e.g., NASDAQ)"),
  },
  async ({ industry, from, to, exchange }) => {
    try {
      const results =
        await marketPerformanceClient.getHistoricalIndustryPerformance(
          industry,
          { from, to, exchange }
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
  "getSectorPESnapshot",
  {
    date: z.string().describe("Date (YYYY-MM-DD)"),
    exchange: z.string().optional().describe("Exchange (e.g., NASDAQ)"),
    sector: z.string().optional().describe("Sector (e.g., Energy)"),
  },
  async ({ date, exchange, sector }) => {
    try {
      const results = await marketPerformanceClient.getSectorPESnapshot(date, {
        exchange,
        sector,
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
  "getIndustryPESnapshot",
  {
    date: z.string().describe("Date (YYYY-MM-DD)"),
    exchange: z.string().optional().describe("Exchange (e.g., NASDAQ)"),
    industry: z.string().optional().describe("Industry (e.g., Biotechnology)"),
  },
  async ({ date, exchange, industry }) => {
    try {
      const results = await marketPerformanceClient.getIndustryPESnapshot(
        date,
        { exchange, industry }
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
  "getHistoricalSectorPE",
  {
    sector: z.string().describe("Sector (e.g., Energy)"),
    from: z.string().optional().describe("Start date (YYYY-MM-DD)"),
    to: z.string().optional().describe("End date (YYYY-MM-DD)"),
    exchange: z.string().optional().describe("Exchange (e.g., NASDAQ)"),
  },
  async ({ sector, from, to, exchange }) => {
    try {
      const results = await marketPerformanceClient.getHistoricalSectorPE(
        sector,
        { from, to, exchange }
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
  "getHistoricalIndustryPE",
  {
    industry: z.string().describe("Industry (e.g., Biotechnology)"),
    from: z.string().optional().describe("Start date (YYYY-MM-DD)"),
    to: z.string().optional().describe("End date (YYYY-MM-DD)"),
    exchange: z.string().optional().describe("Exchange (e.g., NASDAQ)"),
  },
  async ({ industry, from, to, exchange }) => {
    try {
      const results = await marketPerformanceClient.getHistoricalIndustryPE(
        industry,
        { from, to, exchange }
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

server.tool("getBiggestGainers", {}, async () => {
  try {
    const results = await marketPerformanceClient.getBiggestGainers();
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

server.tool("getBiggestLosers", {}, async () => {
  try {
    const results = await marketPerformanceClient.getBiggestLosers();
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

server.tool("getMostActiveStocks", {}, async () => {
  try {
    const results = await marketPerformanceClient.getMostActiveStocks();
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

// Register market hours tools
server.tool(
  "getExchangeMarketHours",
  {
    exchange: z.string().describe("Exchange code (e.g., NASDAQ, NYSE)"),
  },
  async ({ exchange }) => {
    try {
      const results = await marketHoursClient.getExchangeMarketHours(exchange);
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

server.tool("getAllExchangeMarketHours", {}, async () => {
  try {
    const results = await marketHoursClient.getAllExchangeMarketHours();
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

// Register news tools
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

// Register technical indicators tools
server.tool(
  "getSMA",
  {
    symbol: z.string().describe("Stock symbol"),
    periodLength: z.number().describe("Period length for the indicator"),
    timeframe: z
      .string()
      .describe("Timeframe (1min, 5min, 15min, 30min, 1hour, 4hour, 1day)"),
    from: z.string().optional().describe("Start date (YYYY-MM-DD)"),
    to: z.string().optional().describe("End date (YYYY-MM-DD)"),
  },
  async ({ symbol, periodLength, timeframe, from, to }) => {
    try {
      const results = await technicalIndicatorsClient.getSMA({
        symbol,
        periodLength,
        timeframe,
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
  "getEMA",
  {
    symbol: z.string().describe("Stock symbol"),
    periodLength: z.number().describe("Period length for the indicator"),
    timeframe: z
      .string()
      .describe("Timeframe (1min, 5min, 15min, 30min, 1hour, 4hour, 1day)"),
    from: z.string().optional().describe("Start date (YYYY-MM-DD)"),
    to: z.string().optional().describe("End date (YYYY-MM-DD)"),
  },
  async ({ symbol, periodLength, timeframe, from, to }) => {
    try {
      const results = await technicalIndicatorsClient.getEMA({
        symbol,
        periodLength,
        timeframe,
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
  "getWMA",
  {
    symbol: z.string().describe("Stock symbol"),
    periodLength: z.number().describe("Period length for the indicator"),
    timeframe: z
      .string()
      .describe("Timeframe (1min, 5min, 15min, 30min, 1hour, 4hour, 1day)"),
    from: z.string().optional().describe("Start date (YYYY-MM-DD)"),
    to: z.string().optional().describe("End date (YYYY-MM-DD)"),
  },
  async ({ symbol, periodLength, timeframe, from, to }) => {
    try {
      const results = await technicalIndicatorsClient.getWMA({
        symbol,
        periodLength,
        timeframe,
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
  "getDEMA",
  {
    symbol: z.string().describe("Stock symbol"),
    periodLength: z.number().describe("Period length for the indicator"),
    timeframe: z
      .string()
      .describe("Timeframe (1min, 5min, 15min, 30min, 1hour, 4hour, 1day)"),
    from: z.string().optional().describe("Start date (YYYY-MM-DD)"),
    to: z.string().optional().describe("End date (YYYY-MM-DD)"),
  },
  async ({ symbol, periodLength, timeframe, from, to }) => {
    try {
      const results = await technicalIndicatorsClient.getDEMA({
        symbol,
        periodLength,
        timeframe,
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
  "getTEMA",
  {
    symbol: z.string().describe("Stock symbol"),
    periodLength: z.number().describe("Period length for the indicator"),
    timeframe: z
      .string()
      .describe("Timeframe (1min, 5min, 15min, 30min, 1hour, 4hour, 1day)"),
    from: z.string().optional().describe("Start date (YYYY-MM-DD)"),
    to: z.string().optional().describe("End date (YYYY-MM-DD)"),
  },
  async ({ symbol, periodLength, timeframe, from, to }) => {
    try {
      const results = await technicalIndicatorsClient.getTEMA({
        symbol,
        periodLength,
        timeframe,
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
  "getRSI",
  {
    symbol: z.string().describe("Stock symbol"),
    periodLength: z.number().describe("Period length for the indicator"),
    timeframe: z
      .string()
      .describe("Timeframe (1min, 5min, 15min, 30min, 1hour, 4hour, 1day)"),
    from: z.string().optional().describe("Start date (YYYY-MM-DD)"),
    to: z.string().optional().describe("End date (YYYY-MM-DD)"),
  },
  async ({ symbol, periodLength, timeframe, from, to }) => {
    try {
      const results = await technicalIndicatorsClient.getRSI({
        symbol,
        periodLength,
        timeframe,
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
  "getStandardDeviation",
  {
    symbol: z.string().describe("Stock symbol"),
    periodLength: z.number().describe("Period length for the indicator"),
    timeframe: z
      .string()
      .describe("Timeframe (1min, 5min, 15min, 30min, 1hour, 4hour, 1day)"),
    from: z.string().optional().describe("Start date (YYYY-MM-DD)"),
    to: z.string().optional().describe("End date (YYYY-MM-DD)"),
  },
  async ({ symbol, periodLength, timeframe, from, to }) => {
    try {
      const results = await technicalIndicatorsClient.getStandardDeviation({
        symbol,
        periodLength,
        timeframe,
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
  "getWilliams",
  {
    symbol: z.string().describe("Stock symbol"),
    periodLength: z.number().describe("Period length for the indicator"),
    timeframe: z
      .string()
      .describe("Timeframe (1min, 5min, 15min, 30min, 1hour, 4hour, 1day)"),
    from: z.string().optional().describe("Start date (YYYY-MM-DD)"),
    to: z.string().optional().describe("End date (YYYY-MM-DD)"),
  },
  async ({ symbol, periodLength, timeframe, from, to }) => {
    try {
      const results = await technicalIndicatorsClient.getWilliams({
        symbol,
        periodLength,
        timeframe,
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
  "getADX",
  {
    symbol: z.string().describe("Stock symbol"),
    periodLength: z.number().describe("Period length for the indicator"),
    timeframe: z
      .string()
      .describe("Timeframe (1min, 5min, 15min, 30min, 1hour, 4hour, 1day)"),
    from: z.string().optional().describe("Start date (YYYY-MM-DD)"),
    to: z.string().optional().describe("End date (YYYY-MM-DD)"),
  },
  async ({ symbol, periodLength, timeframe, from, to }) => {
    try {
      const results = await technicalIndicatorsClient.getADX({
        symbol,
        periodLength,
        timeframe,
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

// Register quotes tools
server.tool(
  "getQuote",
  {
    symbol: z.string().describe("Stock symbol"),
  },
  async ({ symbol }) => {
    try {
      const results = await quotesClient.getQuote({ symbol });
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
  "getQuoteShort",
  {
    symbol: z.string().describe("Stock symbol"),
  },
  async ({ symbol }) => {
    try {
      const results = await quotesClient.getQuoteShort({ symbol });
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
  "getAftermarketTrade",
  {
    symbol: z.string().describe("Stock symbol"),
  },
  async ({ symbol }) => {
    try {
      const results = await quotesClient.getAftermarketTrade({ symbol });
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
  "getAftermarketQuote",
  {
    symbol: z.string().describe("Stock symbol"),
  },
  async ({ symbol }) => {
    try {
      const results = await quotesClient.getAftermarketQuote({ symbol });
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
  "getStockPriceChange",
  {
    symbol: z.string().describe("Stock symbol"),
  },
  async ({ symbol }) => {
    try {
      const results = await quotesClient.getStockPriceChange({ symbol });
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
  "getBatchQuotes",
  {
    symbols: z.string().describe("Comma-separated list of stock symbols"),
  },
  async ({ symbols }) => {
    try {
      const results = await quotesClient.getBatchQuotes({ symbols });
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
  "getBatchQuotesShort",
  {
    symbols: z.string().describe("Comma-separated list of stock symbols"),
  },
  async ({ symbols }) => {
    try {
      const results = await quotesClient.getBatchQuotesShort({ symbols });
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
  "getBatchAftermarketTrade",
  {
    symbols: z.string().describe("Comma-separated list of stock symbols"),
  },
  async ({ symbols }) => {
    try {
      const results = await quotesClient.getBatchAftermarketTrade({ symbols });
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
  "getBatchAftermarketQuote",
  {
    symbols: z.string().describe("Comma-separated list of stock symbols"),
  },
  async ({ symbols }) => {
    try {
      const results = await quotesClient.getBatchAftermarketQuote({ symbols });
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
  "getExchangeQuotes",
  {
    exchange: z.string().describe("Exchange name (e.g., NASDAQ, NYSE)"),
    short: z.boolean().optional().describe("Whether to use short format"),
  },
  async ({ exchange, short }) => {
    try {
      const results = await quotesClient.getExchangeQuotes({ exchange, short });
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
  "getMutualFundQuotes",
  {
    short: z.boolean().optional().describe("Whether to use short format"),
  },
  async ({ short }) => {
    try {
      const results = await quotesClient.getMutualFundQuotes({ short });
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
  "getETFQuotes",
  {
    short: z.boolean().optional().describe("Whether to use short format"),
  },
  async ({ short }) => {
    try {
      const results = await quotesClient.getETFQuotes({ short });
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
  "getCommodityQuotes",
  {
    short: z.boolean().optional().describe("Whether to use short format"),
  },
  async ({ short }) => {
    try {
      const results = await quotesClient.getCommodityQuotes({ short });
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
  "getCryptoQuotes",
  {
    short: z.boolean().optional().describe("Whether to use short format"),
  },
  async ({ short }) => {
    try {
      const results = await quotesClient.getCryptoQuotes({ short });
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
  "getForexQuotes",
  {
    short: z.boolean().optional().describe("Whether to use short format"),
  },
  async ({ short }) => {
    try {
      const results = await quotesClient.getForexQuotes({ short });
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
  "getIndexQuotes",
  {
    short: z.boolean().optional().describe("Whether to use short format"),
  },
  async ({ short }) => {
    try {
      const results = await quotesClient.getIndexQuotes({ short });
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

// Register earnings transcript tools
server.tool(
  "getLatestEarningsTranscripts",
  {
    limit: z.number().optional().describe("Limit the number of results"),
    page: z.number().optional().describe("Page number for pagination"),
  },
  async ({ limit, page }) => {
    try {
      const results = await earningsTranscriptClient.getLatestTranscripts({
        limit,
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
  "getEarningsTranscript",
  {
    symbol: z.string().describe("Stock symbol"),
    year: z.string().describe("Year of the earnings call"),
    quarter: z
      .string()
      .describe("Quarter of the earnings call (e.g., 1, 2, 3, 4)"),
    limit: z.number().optional().describe("Limit the number of results"),
  },
  async ({ symbol, year, quarter, limit }) => {
    try {
      const results = await earningsTranscriptClient.getTranscript({
        symbol,
        year,
        quarter,
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
  "getEarningsTranscriptDates",
  {
    symbol: z.string().describe("Stock symbol"),
  },
  async ({ symbol }) => {
    try {
      const results = await earningsTranscriptClient.getTranscriptDates({
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

server.tool("getAvailableTranscriptSymbols", {}, async () => {
  try {
    const results =
      await earningsTranscriptClient.getAvailableTranscriptSymbols();
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

// Register SEC filings tools
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
  "getCompanyProfile",
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

// Register government trading tools
server.tool(
  "getLatestSenateDisclosures",
  {
    page: z.number().optional().describe("Page number for pagination"),
    limit: z.number().optional().describe("Limit the number of results"),
  },
  async ({ page, limit }) => {
    try {
      const results = await governmentTradingClient.getLatestSenateDisclosures({
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
  "getLatestHouseDisclosures",
  {
    page: z.number().optional().describe("Page number for pagination"),
    limit: z.number().optional().describe("Limit the number of results"),
  },
  async ({ page, limit }) => {
    try {
      const results = await governmentTradingClient.getLatestHouseDisclosures({
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
  "getSenateTrades",
  {
    symbol: z.string().describe("Stock symbol"),
  },
  async ({ symbol }) => {
    try {
      const results = await governmentTradingClient.getSenateTrades({
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
  "getSenateTradesByName",
  {
    name: z.string().describe("Senator name (first or last name)"),
  },
  async ({ name }) => {
    try {
      const results = await governmentTradingClient.getSenateTradesByName({
        name,
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
  "getHouseTrades",
  {
    symbol: z.string().describe("Stock symbol"),
  },
  async ({ symbol }) => {
    try {
      const results = await governmentTradingClient.getHouseTrades({
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
  "getHouseTradesByName",
  {
    name: z.string().describe("Representative name (first or last name)"),
  },
  async ({ name }) => {
    try {
      const results = await governmentTradingClient.getHouseTradesByName({
        name,
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

// Register bulk data tools
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

console.log(
  "Financial Modeling Prep MCP initialized successfully with provided token"
);

// Create a StdioServerTransport and connect to it
const transport = new StdioServerTransport();
server.connect(transport).catch((error) => {
  console.error("Failed to connect to transport:", error);
  process.exit(1);
});
