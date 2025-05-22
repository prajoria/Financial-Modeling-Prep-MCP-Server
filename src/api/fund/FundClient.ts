import { FMPClient } from "../FMPClient.js";
import {
  FundHolding,
  FundInfo,
  FundCountryAllocation,
  FundAssetExposure,
  FundSectorWeighting,
  FundDisclosure,
  FundDisclosureSearch,
  FundDisclosureDate,
} from "./types.js";

export class FundClient extends FMPClient {
  constructor(apiKey: string) {
    super(apiKey);
  }

  /**
   * Get fund(ETF and Mutual Funds) holdings for a symbol
   * @param symbol The fund symbol
   * @param limit Optional limit on number of results
   * @returns Array of fund holdings
   */
  async getHoldings(symbol: string, limit?: number): Promise<FundHolding[]> {
    return super.get<FundHolding[]>("/etf-holdings", { symbol, limit });
  }

  /**
   * Get fund(ETF and Mutual Funds) information for a symbol
   * @param symbol The fund symbol
   * @returns Fund information
   */
  async getInfo(symbol: string): Promise<FundInfo> {
    return super.get<FundInfo>("/etf-info", { symbol });
  }

  /**
   * Get fund(ETF and Mutual Funds) country allocation for a symbol
   * @param symbol The fund symbol
   * @returns Array of country allocations
   */
  async getCountryAllocation(symbol: string): Promise<FundCountryAllocation[]> {
    return super.get<FundCountryAllocation[]>("/etf-country-allocation", {
      symbol,
    });
  }

  /**
   * Get fund(ETF and Mutual Funds) asset exposure for a symbol
   * @param symbol The fund symbol
   * @returns Array of asset exposures
   */
  async getAssetExposure(symbol: string): Promise<FundAssetExposure[]> {
    return super.get<FundAssetExposure[]>("/etf-asset-exposure", { symbol });
  }

  /**
   * Get fund(ETF and Mutual Funds) sector weighting for a symbol
   * @param symbol The fund symbol
   * @returns Array of sector weightings
   */
  async getSectorWeighting(symbol: string): Promise<FundSectorWeighting[]> {
    return super.get<FundSectorWeighting[]>("/etf-sector-weighting", {
      symbol,
    });
  }

  /**
   * Get fund(ETF and Mutual Funds) disclosure for a symbol
   * @param symbol The fund symbol
   * @param limit Optional limit on number of results
   * @returns Array of fund disclosures
   */
  async getDisclosure(
    symbol: string,
    limit?: number
  ): Promise<FundDisclosure[]> {
    return super.get<FundDisclosure[]>("/etf-disclosure", { symbol, limit });
  }

  /**
   * Search fund(ETF and Mutual Funds) disclosures
   * @param query Search query
   * @param limit Optional limit on number of results
   * @returns Array of fund disclosure search results
   */
  async searchDisclosures(
    query: string,
    limit?: number
  ): Promise<FundDisclosureSearch[]> {
    return super.get<FundDisclosureSearch[]>("/etf-disclosure-search", {
      query,
      limit,
    });
  }

  /**
   * Get fund(ETF and Mutual Funds) disclosure dates for a symbol
   * @param symbol The fund symbol
   * @returns Array of fund disclosure dates
   */
  async getDisclosureDates(symbol: string): Promise<FundDisclosureDate[]> {
    return super.get<FundDisclosureDate[]>("/etf-disclosure-dates", {
      symbol,
    });
  }
}
