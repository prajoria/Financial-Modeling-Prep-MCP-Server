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

export class CommodityClient extends FMPClient {
  constructor(apiKey: string) {
    super(apiKey);
  }

  /**
   * Get commodity price for a symbol
   * @param symbol The commodity symbol
   * @returns Commodity price data
   */
  async getPrice(symbol: string): Promise<CommodityPrice> {
    return super.get<CommodityPrice>("/commodity-price", { symbol });
  }

  /**
   * Get historical commodity prices for a symbol
   * @param symbol The commodity symbol
   * @param limit Optional limit on number of results
   * @returns Array of historical prices
   */
  async getHistoricalPrices(
    symbol: string,
    limit?: number
  ): Promise<CommodityHistoricalPrice[]> {
    return super.get<CommodityHistoricalPrice[]>(
      "/commodity-historical-price",
      {
        symbol,
        limit,
      }
    );
  }

  /**
   * Get commodity quote for a symbol
   * @param symbol The commodity symbol
   * @returns Commodity quote data
   */
  async getQuote(symbol: string): Promise<CommodityQuote> {
    return super.get<CommodityQuote>("/commodity-quote", { symbol });
  }

  /**
   * Get commodity contract for a symbol
   * @param symbol The commodity symbol
   * @returns Commodity contract data
   */
  async getContract(symbol: string): Promise<CommodityContract> {
    return super.get<CommodityContract>("/commodity-contract", { symbol });
  }

  /**
   * Get commodity market data for a symbol
   * @param symbol The commodity symbol
   * @returns Commodity market data
   */
  async getMarketData(symbol: string): Promise<CommodityMarketData> {
    return super.get<CommodityMarketData>("/commodity-market-data", { symbol });
  }

  /**
   * Get commodity news for a symbol
   * @param symbol The commodity symbol
   * @param limit Optional limit on number of results
   * @returns Array of commodity news
   */
  async getNews(symbol: string, limit?: number): Promise<CommodityNews[]> {
    return super.get<CommodityNews[]>("/commodity-news", { symbol, limit });
  }

  /**
   * Get commodity forecast for a symbol
   * @param symbol The commodity symbol
   * @returns Commodity forecast data
   */
  async getForecast(symbol: string): Promise<CommodityForecast> {
    return super.get<CommodityForecast>("/commodity-forecast", { symbol });
  }

  /**
   * Get commodity supply and demand for a symbol
   * @param symbol The commodity symbol
   * @returns Commodity supply and demand data
   */
  async getSupplyDemand(symbol: string): Promise<CommoditySupplyDemand> {
    return super.get<CommoditySupplyDemand>("/commodity-supply-demand", {
      symbol,
    });
  }
}
