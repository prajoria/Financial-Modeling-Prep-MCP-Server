# Financial Modeling Prep MCP (Model Context Protocol)

[![smithery badge](https://smithery.ai/badge/@imbenrabi/financial-modeling-prep-mcp)](https://smithery.ai/server/@imbenrabi/financial-modeling-prep-mcp)

A Model Context Protocol (MCP) implementation for Financial Modeling Prep, enabling AI assistants to access and analyze financial data, stock information, company fundamentals, and market insights.

## Usage

For JSON configuration (for use with AI assistant frameworks):

```json
{
  "command": "npx",
  "args": ["-y", "fmp-mcp", "--stdio"],
  "env": {
    "FMP_ACCESS_TOKEN": "YOUR_FMP_ACCESS_TOKEN"
  }
}
```

Or with arguments instead of environment variables:

```json
{
  "command": "npx",
  "args": ["-y", "fmp-mcp", "--stdio", "--fmp-token=YOUR_FMP_ACCESS_TOKEN"]
}
```

## Available Tools

This MCP provides the following tools for AI assistants to access financial data:

### Search Tools

- **searchSymbol**: Search for stock symbols by name or ticker
- **searchName**: Search for companies by name
- **searchCIK**: Search for companies by CIK number
- **searchCUSIP**: Search for securities by CUSIP number
- **searchISIN**: Search for securities by ISIN number
- **stockScreener**: Screen stocks based on various criteria

### Directory and Symbol Lists

- **getCompanySymbols**: Get a list of all company symbols
- **getFinancialStatementSymbols**: Get symbols with available financial statements
- **getETFList**: Get a list of all ETFs
- **getActivelyTradingList**: Get a list of actively trading stocks
- **getEarningsTranscriptList**: Get a list of companies with earnings transcripts
- **getAvailableExchanges**: Get a list of all available exchanges
- **getAvailableSectors**: Get a list of all available sectors
- **getAvailableIndustries**: Get a list of all available industries
- **getAvailableCountries**: Get a list of all available countries
- **getAvailableTranscriptSymbols**: Get a list of symbols with available transcripts

### Company Information

- **getCompanyProfile**: Get detailed company profile information
- **getCompanyExecutives**: Get information about company executives
- **getCompanyDescription**: Get company description
- **getCompanyOutlook**: Get company outlook information
- **getCompanyRating**: Get company rating information
- **getHistoricalRating**: Get historical company ratings
- **getCompanyUpgradesDowngrades**: Get company upgrades and downgrades
- **getCompanyGrade**: Get company grade information
- **getCompanyPeers**: Get companies similar to a given company
- **getMarketCap**: Get company market capitalization
- **getHistoricalMarketCap**: Get historical market capitalization
- **getSharesFloat**: Get company shares float information
- **getHistoricalSharesFloat**: Get historical shares float information
- **getEarningsSurprises**: Get historical earnings surprises
- **getEarningCallTranscript**: Get specific earnings call transcript
- **getEarningCallTranscriptsBySymbol**: Get all earnings call transcripts for a symbol

### Financial Statements

- **getIncomeStatement**: Get company income statements
- **getBalanceSheet**: Get company balance sheet statements
- **getCashFlowStatement**: Get company cash flow statements
- **getIncomeStatementAsReported**: Get income statements as reported
- **getBalanceSheetAsReported**: Get balance sheet statements as reported
- **getCashFlowStatementAsReported**: Get cash flow statements as reported
- **getFullFinancialStatementAsReported**: Get full financial statements as reported
- **getFinancialReportDates**: Get dates of available financial reports

### Financial Metrics and Analysis

- **getKeyMetrics**: Get key financial metrics for a company
- **getKeyMetricsTTM**: Get key metrics for trailing twelve months
- **getFinancialRatios**: Get financial ratios for a company
- **getFinancialRatiosTTM**: Get financial ratios for trailing twelve months
- **getFinancialGrowth**: Get financial growth metrics
- **getIncomeStatementGrowth**: Get income statement growth metrics
- **getBalanceSheetGrowth**: Get balance sheet growth metrics
- **getCashFlowStatementGrowth**: Get cash flow statement growth metrics
- **getDiscountedCashFlow**: Get discounted cash flow valuation
- **getHistoricalDCF**: Get historical DCF valuations
- **getAdvancedDCF**: Get advanced DCF valuation
- **getLeveredDCF**: Get levered DCF valuation
- **getEnterpriseValue**: Get enterprise value for a company
- **getFinancialScore**: Get financial score for a company
- **getOwnerEarnings**: Get owner earnings for a company

### Quotes and Price Data

- **getQuote**: Get current stock quote information
- **getBatchQuotes**: Get quotes for multiple symbols
- **getHistoricalPrice**: Get historical price data
- **getHistoricalPriceChart**: Get historical price chart data
- **getHistoricalDailyPrice**: Get historical daily price data
- **getHistoricalStockSplits**: Get historical stock splits
- **getHistoricalDividends**: Get historical dividends
- **getTechnicalIndicator**: Get technical indicators for a stock

### Market Indexes and Performance

- **getIndexList**: Get a list of all market indexes
- **getIndexQuotes**: Get quotes for market indexes
- **getAllIndexQuotes**: Get quotes for all market indexes
- **getSP500Constituents**: Get S&P 500 constituent companies
- **getHistoricalSP500Changes**: Get historical S&P 500 changes
- **getNasdaqConstituents**: Get NASDAQ constituent companies
- **getDowJonesConstituents**: Get Dow Jones constituent companies
- **getHistoricalNasdaqChanges**: Get historical NASDAQ changes
- **getHistoricalDowJonesChanges**: Get historical Dow Jones changes
- **getSectorPerformance**: Get sector performance data
- **getHistoricalSectorPerformance**: Get historical sector performance
- **getBiggestGainers**: Get biggest gaining stocks
- **getBiggestLosers**: Get biggest losing stocks
- **getMostActiveStocks**: Get most active stocks

### Market Data

- **getMarketHours**: Get market hours for a specific exchange
- **getAllExchangeMarketHours**: Get market hours for all exchanges
- **getEarningsCalendar**: Get earnings announcement calendar
- **getIPOCalendar**: Get initial public offering calendar
- **getStockSplitCalendar**: Get stock split calendar
- **getDividendCalendar**: Get dividend calendar
- **getEconomicCalendar**: Get economic events calendar

### News and Press Releases

- **getFMPArticles**: Get financial news articles from FMP
- **getGeneralNews**: Get general financial news
- **getStockNews**: Get news for specific stocks
- **getStockNewsSentiment**: Get news with sentiment analysis
- **getPressReleases**: Get company press releases

### Insider and Institutional Trading

- **getInsiderTrading**: Get insider trading data
- **getInsiderRoster**: Get insider roster for a company
- **getInsiderRosterStatistics**: Get statistics on insider roster
- **getInsiderTransactionTypes**: Get types of insider transactions
- **getInsiderOwnership**: Get insider ownership information
- **getInstitutionalOwnership**: Get institutional ownership data
- **getInstitutionalHolders**: Get institutional holders for a company
- **getInstitutionalHoldersList**: Get list of institutional holders
- **getInstitutionalHolderPortfolioDates**: Get portfolio dates for institutional holders
- **get13FFilings**: Get 13F filings
- **get13FDates**: Get dates of 13F filings

### ETFs and Funds

- **getETFHolder**: Get ETF holder information
- **getETFSectorWeighting**: Get ETF sector weightings
- **getETFCountryWeighting**: Get ETF country weightings
- **getETFExposure**: Get ETF exposure to stocks
- **getFundInfo**: Get fund information
- **getFundHolder**: Get fund holder information
- **getFundSectorWeighting**: Get fund sector weightings

### Cryptocurrency and Forex

- **getCryptocurrencyList**: Get a list of cryptocurrencies
- **getCryptocurrencyQuote**: Get cryptocurrency quote
- **getCryptocurrencyBatchQuotes**: Get quotes for multiple cryptocurrencies
- **getHistoricalCryptocurrencyPrice**: Get historical cryptocurrency price data
- **getForexList**: Get a list of forex pairs
- **getForexQuote**: Get forex pair quote
- **getForexBatchQuotes**: Get quotes for multiple forex pairs
- **getHistoricalForexPrice**: Get historical forex price data

### Special Data Sets

- **getCOTList**: Get Commitment of Traders (COT) list
- **getCOTReport**: Get COT report for a specific symbol
- **getCOTAnalysis**: Get COT analysis for a specific symbol
- **getGovernmentTradingList**: Get government trading list
- **getSenateTrading**: Get senate trading data
- **getHouseTrading**: Get house trading data
- **getESGData**: Get Environmental, Social, and Governance data
- **getESGRatings**: Get ESG ratings
- **getESGBenchmark**: Get ESG benchmark data

### Bulk Data Tools

- **getCompanyProfilesBulk**: Get bulk company profiles
- **getStockRatingsBulk**: Get bulk stock ratings
- **getDCFValuationsBulk**: Get bulk DCF valuations
- **getFinancialScoresBulk**: Get bulk financial scores
- **getPriceTargetSummariesBulk**: Get bulk price target summaries
- **getUpgradesDowngradesConsensusBulk**: Get bulk upgrades/downgrades consensus
- **getKeyMetricsTTMBulk**: Get bulk key metrics TTM
- **getRatiosTTMBulk**: Get bulk ratios TTM
- **getStockPeersBulk**: Get bulk stock peers
- **getEODDataBulk**: Get bulk end-of-day price data
- **getIncomeStatementsBulk**: Get bulk income statements
- **getBalanceSheetsBulk**: Get bulk balance sheets
- **getCashFlowStatementsBulk**: Get bulk cash flow statements
- **getFinancialRatiosBulk**: Get bulk financial ratios
- **getKeyMetricsBulk**: Get bulk key metrics
- **getFinancialGrowthBulk**: Get bulk financial growth data

Most tools accept optional parameters such as:

- `symbol`: Stock ticker symbol
- `period`: Time period (annual, quarterly)
- `limit`: Number of results to return
- `from` and `to`: Date range in YYYY-MM-DD format

## Obtaining a Financial Modeling Prep Access Token

To get a Financial Modeling Prep access token:

1. Visit the [Financial Modeling Prep website](https://site.financialmodelingprep.com/)
2. Click on "Sign Up" to create an account
3. Verify your email address
4. After signing in, navigate to your Dashboard to find your API key
5. For more data access, consider upgrading to a paid plan (Starter, Premium, Ultimate, or Enterprise)

Financial Modeling Prep offers different pricing tiers with varying levels of data access and API call limits. For more information, visit the [FMP Pricing page](https://site.financialmodelingprep.com/pricing).

## Contributing

Contributions are welcome! Here's how you can contribute:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

Every pull request triggers a GitHub Actions workflow that verifies the build process.

### Development Setup

```bash
# Clone the repository
git clone https://github.com/TODO
cd fmp-mcp-server

# Install dependencies
npm install

# Build the project
npm run build

# Run in development mode
npm run dev
```

### Release Process

To publish a new version to NPM:

1. Update the version in `package.json`
2. Create a new GitHub release with a tag like `v1.0.1`
3. The GitHub Actions workflow will automatically build and publish the package to NPM

Make sure you have the `NPM_TOKEN` secret configured in your GitHub repository settings.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
