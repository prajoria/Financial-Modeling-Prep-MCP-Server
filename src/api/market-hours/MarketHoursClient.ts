import { FMPClient } from "../FMPClient.js";
import { ExchangeMarketHours } from "./types.js";

export class MarketHoursClient extends FMPClient {
  /**
   * Get market hours for a specific exchange
   */
  async getExchangeMarketHours(
    exchange: string
  ): Promise<ExchangeMarketHours[]> {
    return super.get<ExchangeMarketHours[]>("/exchange-market-hours", {
      exchange,
    });
  }

  /**
   * Get market hours for all exchanges
   */
  async getAllExchangeMarketHours(): Promise<ExchangeMarketHours[]> {
    return super.get<ExchangeMarketHours[]>("/all-exchange-market-hours");
  }
}
