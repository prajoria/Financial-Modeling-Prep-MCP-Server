import { FMPClient } from "../FMPClient.js";
import {
  TreasuryRate,
  EconomicIndicator,
  EconomicCalendar,
  MarketRiskPremium,
} from "./types.js";

export class EconomicsClient extends FMPClient {
  constructor(apiKey: string) {
    super(apiKey);
  }

  /**
   * Get treasury rates
   * @param limit Optional limit on number of results
   * @returns Array of treasury rates
   */
  async getTreasuryRates(limit?: number): Promise<TreasuryRate[]> {
    return super.get<TreasuryRate[]>("/treasury-rates", { limit });
  }

  /**
   * Get economic indicators
   * @param indicator Optional specific indicator to get
   * @param limit Optional limit on number of results
   * @returns Array of economic indicators
   */
  async getEconomicIndicators(
    indicator?: string,
    limit?: number
  ): Promise<EconomicIndicator[]> {
    return super.get<EconomicIndicator[]>("/economic-indicator", {
      indicator,
      limit,
    });
  }

  /**
   * Get economic calendar
   * @param from Start date (YYYY-MM-DD)
   * @param to End date (YYYY-MM-DD)
   * @returns Array of economic calendar events
   */
  async getEconomicCalendar(
    from: string,
    to: string
  ): Promise<EconomicCalendar[]> {
    return super.get<EconomicCalendar[]>("/economic-calendar", { from, to });
  }

  /**
   * Get market risk premium
   * @param limit Optional limit on number of results
   * @returns Array of market risk premiums
   */
  async getMarketRiskPremium(limit?: number): Promise<MarketRiskPremium[]> {
    return super.get<MarketRiskPremium[]>("/market-risk-premium", { limit });
  }
}
