import { FMPClient } from "../FMPClient.js";
import {
  ForexPair,
  ForexQuote,
  ForexShortQuote,
  ForexLightPrice,
  ForexHistoricalPrice,
  ForexIntradayPrice,
} from "./types.js";

export class ForexClient extends FMPClient {
  constructor(apiKey: string) {
    super(apiKey);
  }

  /**
   * Get a list of all forex currency pairs
   * @returns Array of forex pair information
   */
  async getList(options?: { signal?: AbortSignal }): Promise<ForexPair[]> {
    return super.get<ForexPair[]>("/forex-list", {}, options);
  }

  /**
   * Get full quote for a forex pair
   * @param symbol The forex pair symbol (e.g., EURUSD)
   * @returns Array of forex quotes
   */
  async getQuote(
    symbol: string,
    options?: { signal?: AbortSignal }
  ): Promise<ForexQuote[]> {
    return super.get<ForexQuote[]>("/quote", { symbol }, options);
  }

  /**
   * Get short quote for a forex pair
   * @param symbol The forex pair symbol (e.g., EURUSD)
   * @returns Array of forex short quotes
   */
  async getShortQuote(
    symbol: string,
    options?: { signal?: AbortSignal }
  ): Promise<ForexShortQuote[]> {
    return super.get<ForexShortQuote[]>("/quote-short", { symbol }, options);
  }

  /**
   * Get batch quotes for all forex pairs
   * @returns Array of forex short quotes
   */
  async getBatchQuotes(options?: {
    signal?: AbortSignal;
  }): Promise<ForexShortQuote[]> {
    return super.get<ForexShortQuote[]>(
      "/batch-forex-quotes",
      { short: true },
      options
    );
  }

  /**
   * Get historical light chart data for a forex pair
   * @param symbol The forex pair symbol (e.g., EURUSD)
   * @param from Optional start date (YYYY-MM-DD)
   * @param to Optional end date (YYYY-MM-DD)
   * @returns Array of forex light prices
   */
  async getHistoricalLightChart(
    symbol: string,
    from?: string,
    to?: string,
    options?: { signal?: AbortSignal }
  ): Promise<ForexLightPrice[]> {
    return super.get<ForexLightPrice[]>(
      "/historical-price-eod/light",
      { symbol, from, to },
      options
    );
  }

  /**
   * Get historical full chart data for a forex pair
   * @param symbol The forex pair symbol (e.g., EURUSD)
   * @param from Optional start date (YYYY-MM-DD)
   * @param to Optional end date (YYYY-MM-DD)
   * @returns Array of forex historical prices
   */
  async getHistoricalFullChart(
    symbol: string,
    from?: string,
    to?: string,
    options?: { signal?: AbortSignal }
  ): Promise<ForexHistoricalPrice[]> {
    return super.get<ForexHistoricalPrice[]>(
      "/historical-price-eod/full",
      { symbol, from, to },
      options
    );
  }

  /**
   * Get 1-minute interval data for a forex pair
   * @param symbol The forex pair symbol (e.g., EURUSD)
   * @param from Optional start date (YYYY-MM-DD)
   * @param to Optional end date (YYYY-MM-DD)
   * @returns Array of forex intraday prices
   */
  async get1MinuteData(
    symbol: string,
    from?: string,
    to?: string,
    options?: { signal?: AbortSignal }
  ): Promise<ForexIntradayPrice[]> {
    return super.get<ForexIntradayPrice[]>(
      "/historical-chart/1min",
      { symbol, from, to },
      options
    );
  }

  /**
   * Get 5-minute interval data for a forex pair
   * @param symbol The forex pair symbol (e.g., EURUSD)
   * @param from Optional start date (YYYY-MM-DD)
   * @param to Optional end date (YYYY-MM-DD)
   * @returns Array of forex intraday prices
   */
  async get5MinuteData(
    symbol: string,
    from?: string,
    to?: string,
    options?: { signal?: AbortSignal }
  ): Promise<ForexIntradayPrice[]> {
    return super.get<ForexIntradayPrice[]>(
      "/historical-chart/5min",
      { symbol, from, to },
      options
    );
  }

  /**
   * Get 1-hour interval data for a forex pair
   * @param symbol The forex pair symbol (e.g., EURUSD)
   * @param from Optional start date (YYYY-MM-DD)
   * @param to Optional end date (YYYY-MM-DD)
   * @returns Array of forex intraday prices
   */
  async get1HourData(
    symbol: string,
    from?: string,
    to?: string,
    options?: { signal?: AbortSignal }
  ): Promise<ForexIntradayPrice[]> {
    return super.get<ForexIntradayPrice[]>(
      "/historical-chart/1hour",
      { symbol, from, to },
      options
    );
  }
}
