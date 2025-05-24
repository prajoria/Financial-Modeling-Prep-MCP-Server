import { FMPClient } from "../FMPClient.js";
import {
  CommodityPrice,
  CommodityHistoricalPrice,
  CommodityQuote,
  CommodityContract,
  CommodityMarketData,
  CommodityNews,
  CommodityForecast,
  CommoditySupplyDemand,
} from "./types.js";

// Define a context type for all client methods
type FMPContext = {
  config?: {
    FMP_ACCESS_TOKEN?: string;
  };
};

export class CommodityClient extends FMPClient {
  constructor(apiKey?: string) {
    super(apiKey);
  }

  /**
   * Get commodity price for a symbol
   * @param symbol The commodity symbol
   * @param options Optional parameters including abort signal and context
   * @returns Commodity price data
   */
  async getPrice(
    symbol: string,
    options?: {
      signal?: AbortSignal;
      context?: FMPContext;
    }
  ): Promise<CommodityPrice> {
    return super.get<CommodityPrice>("/commodity-price", { symbol }, options);
  }

  /**
   * Get historical commodity prices for a symbol
   * @param symbol The commodity symbol
   * @param limit Optional limit on number of results
   * @param options Optional parameters including abort signal and context
   * @returns Array of historical prices
   */
  async getHistoricalPrices(
    symbol: string,
    limit?: number,
    options?: {
      signal?: AbortSignal;
      context?: FMPContext;
    }
  ): Promise<CommodityHistoricalPrice[]> {
    return super.get<CommodityHistoricalPrice[]>(
      "/commodity-historical-price",
      {
        symbol,
        limit,
      },
      options
    );
  }

  /**
   * Get commodity quote for a symbol
   * @param symbol The commodity symbol
   * @param options Optional parameters including abort signal and context
   * @returns Commodity quote data
   */
  async getQuote(
    symbol: string,
    options?: {
      signal?: AbortSignal;
      context?: FMPContext;
    }
  ): Promise<CommodityQuote> {
    return super.get<CommodityQuote>("/commodity-quote", { symbol }, options);
  }

  /**
   * Get commodity contract for a symbol
   * @param symbol The commodity symbol
   * @param options Optional parameters including abort signal and context
   * @returns Commodity contract data
   */
  async getContract(
    symbol: string,
    options?: {
      signal?: AbortSignal;
      context?: FMPContext;
    }
  ): Promise<CommodityContract> {
    return super.get<CommodityContract>(
      "/commodity-contract",
      { symbol },
      options
    );
  }

  /**
   * Get commodity market data for a symbol
   * @param symbol The commodity symbol
   * @param options Optional parameters including abort signal and context
   * @returns Commodity market data
   */
  async getMarketData(
    symbol: string,
    options?: {
      signal?: AbortSignal;
      context?: FMPContext;
    }
  ): Promise<CommodityMarketData> {
    return super.get<CommodityMarketData>(
      "/commodity-market-data",
      { symbol },
      options
    );
  }

  /**
   * Get commodity news for a symbol
   * @param symbol The commodity symbol
   * @param limit Optional limit on number of results
   * @param options Optional parameters including abort signal and context
   * @returns Array of commodity news
   */
  async getNews(
    symbol: string,
    limit?: number,
    options?: {
      signal?: AbortSignal;
      context?: FMPContext;
    }
  ): Promise<CommodityNews[]> {
    return super.get<CommodityNews[]>(
      "/commodity-news",
      { symbol, limit },
      options
    );
  }

  /**
   * Get commodity forecast for a symbol
   * @param symbol The commodity symbol
   * @param options Optional parameters including abort signal and context
   * @returns Commodity forecast data
   */
  async getForecast(
    symbol: string,
    options?: {
      signal?: AbortSignal;
      context?: FMPContext;
    }
  ): Promise<CommodityForecast> {
    return super.get<CommodityForecast>(
      "/commodity-forecast",
      { symbol },
      options
    );
  }

  /**
   * Get commodity supply and demand for a symbol
   * @param symbol The commodity symbol
   * @param options Optional parameters including abort signal and context
   * @returns Commodity supply and demand data
   */
  async getSupplyDemand(
    symbol: string,
    options?: {
      signal?: AbortSignal;
      context?: FMPContext;
    }
  ): Promise<CommoditySupplyDemand> {
    return super.get<CommoditySupplyDemand>(
      "/commodity-supply-demand",
      { symbol },
      options
    );
  }
}
