import { FMPClient } from "../FMPClient.js";
import {
  Cryptocurrency,
  CryptocurrencyQuote,
  CryptocurrencyShortQuote,
  CryptocurrencyLightPrice,
  CryptocurrencyHistoricalPrice,
  CryptocurrencyIntradayPrice,
} from "./types.js";

// Define a context type for all client methods
type FMPContext = {
  config?: {
    FMP_ACCESS_TOKEN?: string;
  };
};

export class CryptoClient extends FMPClient {
  constructor(apiKey?: string) {
    super(apiKey);
  }

  /**
   * Get a list of all cryptocurrencies
   * @param context Optional context containing configuration
   * @returns Array of cryptocurrency information
   */
  async getList(options?: {
    signal?: AbortSignal;
    context?: FMPContext;
  }): Promise<Cryptocurrency[]> {
    return super.get<Cryptocurrency[]>("/cryptocurrency-list", {}, options);
  }

  /**
   * Get full quote for a cryptocurrency
   * @param symbol The cryptocurrency symbol (e.g., BTCUSD)
   * @param context Optional context containing configuration
   * @returns Array of cryptocurrency quotes
   */
  async getQuote(
    symbol: string,
    options?: {
      signal?: AbortSignal;
      context?: FMPContext;
    }
  ): Promise<CryptocurrencyQuote[]> {
    return super.get<CryptocurrencyQuote[]>("/quote", { symbol }, options);
  }

  /**
   * Get short quote for a cryptocurrency
   * @param symbol The cryptocurrency symbol (e.g., BTCUSD)
   * @param context Optional context containing configuration
   * @returns Array of cryptocurrency short quotes
   */
  async getShortQuote(
    symbol: string,
    options?: {
      signal?: AbortSignal;
      context?: FMPContext;
    }
  ): Promise<CryptocurrencyShortQuote[]> {
    return super.get<CryptocurrencyShortQuote[]>(
      "/quote-short",
      { symbol },
      options
    );
  }

  /**
   * Get batch quotes for all cryptocurrencies
   * @param context Optional context containing configuration
   * @returns Array of cryptocurrency short quotes
   */
  async getBatchQuotes(options?: {
    signal?: AbortSignal;
    context?: FMPContext;
  }): Promise<CryptocurrencyShortQuote[]> {
    return super.get<CryptocurrencyShortQuote[]>(
      "/batch-crypto-quotes",
      { short: true },
      options
    );
  }

  /**
   * Get historical light chart data for a cryptocurrency
   * @param symbol The cryptocurrency symbol (e.g., BTCUSD)
   * @param from Optional start date (YYYY-MM-DD)
   * @param to Optional end date (YYYY-MM-DD)
   * @param context Optional context containing configuration
   * @returns Array of cryptocurrency light prices
   */
  async getHistoricalLightChart(
    symbol: string,
    from?: string,
    to?: string,
    options?: {
      signal?: AbortSignal;
      context?: FMPContext;
    }
  ): Promise<CryptocurrencyLightPrice[]> {
    return super.get<CryptocurrencyLightPrice[]>(
      "/historical-price-eod/light",
      { symbol, from, to },
      options
    );
  }

  /**
   * Get historical full chart data for a cryptocurrency
   * @param symbol The cryptocurrency symbol (e.g., BTCUSD)
   * @param from Optional start date (YYYY-MM-DD)
   * @param to Optional end date (YYYY-MM-DD)
   * @param context Optional context containing configuration
   * @returns Array of cryptocurrency historical prices
   */
  async getHistoricalFullChart(
    symbol: string,
    from?: string,
    to?: string,
    options?: {
      signal?: AbortSignal;
      context?: FMPContext;
    }
  ): Promise<CryptocurrencyHistoricalPrice[]> {
    return super.get<CryptocurrencyHistoricalPrice[]>(
      "/historical-price-eod/full",
      { symbol, from, to },
      options
    );
  }

  /**
   * Get 1-minute interval data for a cryptocurrency
   * @param symbol The cryptocurrency symbol (e.g., BTCUSD)
   * @param from Optional start date (YYYY-MM-DD)
   * @param to Optional end date (YYYY-MM-DD)
   * @param context Optional context containing configuration
   * @returns Array of cryptocurrency intraday prices
   */
  async get1MinuteData(
    symbol: string,
    from?: string,
    to?: string,
    options?: {
      signal?: AbortSignal;
      context?: FMPContext;
    }
  ): Promise<CryptocurrencyIntradayPrice[]> {
    return super.get<CryptocurrencyIntradayPrice[]>(
      "/historical-chart/1min",
      { symbol, from, to },
      options
    );
  }

  /**
   * Get 5-minute interval data for a cryptocurrency
   * @param symbol The cryptocurrency symbol (e.g., BTCUSD)
   * @param from Optional start date (YYYY-MM-DD)
   * @param to Optional end date (YYYY-MM-DD)
   * @param context Optional context containing configuration
   * @returns Array of cryptocurrency intraday prices
   */
  async get5MinuteData(
    symbol: string,
    from?: string,
    to?: string,
    options?: {
      signal?: AbortSignal;
      context?: FMPContext;
    }
  ): Promise<CryptocurrencyIntradayPrice[]> {
    return super.get<CryptocurrencyIntradayPrice[]>(
      "/historical-chart/5min",
      { symbol, from, to },
      options
    );
  }

  /**
   * Get 1-hour interval data for a cryptocurrency
   * @param symbol The cryptocurrency symbol (e.g., BTCUSD)
   * @param from Optional start date (YYYY-MM-DD)
   * @param to Optional end date (YYYY-MM-DD)
   * @param context Optional context containing configuration
   * @returns Array of cryptocurrency intraday prices
   */
  async get1HourData(
    symbol: string,
    from?: string,
    to?: string,
    options?: {
      signal?: AbortSignal;
      context?: FMPContext;
    }
  ): Promise<CryptocurrencyIntradayPrice[]> {
    return super.get<CryptocurrencyIntradayPrice[]>(
      "/historical-chart/1hour",
      { symbol, from, to },
      options
    );
  }
}
