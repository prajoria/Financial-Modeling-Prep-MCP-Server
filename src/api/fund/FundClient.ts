import { FMPClient } from "../FMPClient.js";
import type { FMPContext } from "../../types/index.js";
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
  constructor(apiKey?: string) {
    super(apiKey);
  }

  /**
   * Get fund(ETF and Mutual Funds) holdings for a symbol
   * @param symbol The fund symbol
   * @param limit Optional limit on number of results
   * @param options Optional parameters including abort signal and context
   * @returns Array of fund holdings
   */
  async getHoldings(
    symbol: string,
    limit?: number,
    options?: {
      signal?: AbortSignal;
      context?: FMPContext;
    }
  ): Promise<FundHolding[]> {
    return super.get<FundHolding[]>(
      "/etf-holdings",
      { symbol, limit },
      options
    );
  }

  /**
   * Get fund(ETF and Mutual Funds) information for a symbol
   * @param symbol The fund symbol
   * @param options Optional parameters including abort signal and context
   * @returns Fund information
   */
  async getInfo(
    symbol: string,
    options?: {
      signal?: AbortSignal;
      context?: FMPContext;
    }
  ): Promise<FundInfo> {
    return super.get<FundInfo>("/etf-info", { symbol }, options);
  }

  /**
   * Get fund(ETF and Mutual Funds) country allocation for a symbol
   * @param symbol The fund symbol
   * @param options Optional parameters including abort signal and context
   * @returns Array of country allocations
   */
  async getCountryAllocation(
    symbol: string,
    options?: {
      signal?: AbortSignal;
      context?: FMPContext;
    }
  ): Promise<FundCountryAllocation[]> {
    return super.get<FundCountryAllocation[]>(
      "/etf-country-allocation",
      {
        symbol,
      },
      options
    );
  }

  /**
   * Get fund(ETF and Mutual Funds) asset exposure for a symbol
   * @param symbol The fund symbol
   * @param options Optional parameters including abort signal and context
   * @returns Array of asset exposures
   */
  async getAssetExposure(
    symbol: string,
    options?: {
      signal?: AbortSignal;
      context?: FMPContext;
    }
  ): Promise<FundAssetExposure[]> {
    return super.get<FundAssetExposure[]>(
      "/etf-asset-exposure",
      { symbol },
      options
    );
  }

  /**
   * Get fund(ETF and Mutual Funds) sector weighting for a symbol
   * @param symbol The fund symbol
   * @param options Optional parameters including abort signal and context
   * @returns Array of sector weightings
   */
  async getSectorWeighting(
    symbol: string,
    options?: {
      signal?: AbortSignal;
      context?: FMPContext;
    }
  ): Promise<FundSectorWeighting[]> {
    return super.get<FundSectorWeighting[]>(
      "/etf-sector-weighting",
      {
        symbol,
      },
      options
    );
  }

  /**
   * Get fund(ETF and Mutual Funds) disclosure for a symbol
   * @param symbol The fund symbol
   * @param limit Optional limit on number of results
   * @param options Optional parameters including abort signal and context
   * @returns Array of fund disclosures
   */
  async getDisclosure(
    symbol: string,
    limit?: number,
    options?: {
      signal?: AbortSignal;
      context?: FMPContext;
    }
  ): Promise<FundDisclosure[]> {
    return super.get<FundDisclosure[]>(
      "/etf-disclosure",
      { symbol, limit },
      options
    );
  }

  /**
   * Search fund(ETF and Mutual Funds) disclosures
   * @param query Search query
   * @param limit Optional limit on number of results
   * @param options Optional parameters including abort signal and context
   * @returns Array of fund disclosure search results
   */
  async searchDisclosures(
    query: string,
    limit?: number,
    options?: {
      signal?: AbortSignal;
      context?: FMPContext;
    }
  ): Promise<FundDisclosureSearch[]> {
    return super.get<FundDisclosureSearch[]>(
      "/etf-disclosure-search",
      {
        query,
        limit,
      },
      options
    );
  }

  /**
   * Get fund(ETF and Mutual Funds) disclosure dates for a symbol
   * @param symbol The fund symbol
   * @param options Optional parameters including abort signal and context
   * @returns Array of fund disclosure dates
   */
  async getDisclosureDates(
    symbol: string,
    options?: {
      signal?: AbortSignal;
      context?: FMPContext;
    }
  ): Promise<FundDisclosureDate[]> {
    return super.get<FundDisclosureDate[]>(
      "/etf-disclosure-dates",
      {
        symbol,
      },
      options
    );
  }
}
