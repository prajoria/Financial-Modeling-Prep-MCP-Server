import { FMPClient } from "../FMPClient.js";
import { ExchangeMarketHours } from "./types.js";

// Define a context type for all client methods
type FMPContext = {
  config?: {
    FMP_ACCESS_TOKEN?: string;
  };
};

export class MarketHoursClient extends FMPClient {
  constructor(apiKey?: string) {
    super(apiKey);
  }

  /**
   * Get market hours for a specific exchange
   * @param exchange Exchange name/code
   * @param options Optional parameters including abort signal and context
   */
  async getExchangeMarketHours(
    exchange: string,
    options?: {
      signal?: AbortSignal;
      context?: FMPContext;
    }
  ): Promise<ExchangeMarketHours[]> {
    return super.get<ExchangeMarketHours[]>(
      "/exchange-market-hours",
      { exchange },
      options
    );
  }

  /**
   * Get market hours for all exchanges
   * @param options Optional parameters including abort signal and context
   */
  async getAllExchangeMarketHours(options?: {
    signal?: AbortSignal;
    context?: FMPContext;
  }): Promise<ExchangeMarketHours[]> {
    return super.get<ExchangeMarketHours[]>(
      "/all-exchange-market-hours",
      {},
      options
    );
  }
}
