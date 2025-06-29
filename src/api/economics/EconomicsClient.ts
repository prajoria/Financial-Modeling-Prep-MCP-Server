import { FMPClient } from "../FMPClient.js";
import type { FMPContext } from "../../types/index.js";
import {
  TreasuryRate,
  EconomicIndicator,
  EconomicCalendar,
  MarketRiskPremium,
} from "./types.js";



export class EconomicsClient extends FMPClient {
  constructor(apiKey?: string) {
    super(apiKey);
  }

  /**
   * Get treasury rates
   * @param limit Optional limit on number of results
   * @param options Optional parameters including abort signal and context
   * @returns Array of treasury rates
   */
  async getTreasuryRates(
    limit?: number,
    options?: {
      signal?: AbortSignal;
      context?: FMPContext;
    }
  ): Promise<TreasuryRate[]> {
    return super.get<TreasuryRate[]>("/treasury-rates", { limit }, options);
  }

  /**
   * Get economic indicators
   * @param indicator Optional specific indicator to get
   * @param limit Optional limit on number of results
   * @param options Optional parameters including abort signal and context
   * @returns Array of economic indicators
   */
  async getEconomicIndicators(
    indicator?: string,
    limit?: number,
    options?: {
      signal?: AbortSignal;
      context?: FMPContext;
    }
  ): Promise<EconomicIndicator[]> {
    return super.get<EconomicIndicator[]>(
      "/economic-indicator",
      {
        indicator,
        limit,
      },
      options
    );
  }

  /**
   * Get economic calendar
   * @param from Start date (YYYY-MM-DD)
   * @param to End date (YYYY-MM-DD)
   * @param options Optional parameters including abort signal and context
   * @returns Array of economic calendar events
   */
  async getEconomicCalendar(
    from: string,
    to: string,
    options?: {
      signal?: AbortSignal;
      context?: FMPContext;
    }
  ): Promise<EconomicCalendar[]> {
    return super.get<EconomicCalendar[]>(
      "/economic-calendar",
      { from, to },
      options
    );
  }

  /**
   * Get market risk premium
   * @param limit Optional limit on number of results
   * @param options Optional parameters including abort signal and context
   * @returns Array of market risk premiums
   */
  async getMarketRiskPremium(
    limit?: number,
    options?: {
      signal?: AbortSignal;
      context?: FMPContext;
    }
  ): Promise<MarketRiskPremium[]> {
    return super.get<MarketRiskPremium[]>(
      "/market-risk-premium",
      { limit },
      options
    );
  }
}
