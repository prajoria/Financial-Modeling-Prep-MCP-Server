import { FMPClient } from "../FMPClient.js";
import { ESGDisclosure, ESGRating, ESGBenchmark } from "./types.js";

// Define a context type for all client methods
type FMPContext = {
  config?: {
    FMP_ACCESS_TOKEN?: string;
  };
};

export class ESGClient extends FMPClient {
  constructor(apiKey?: string) {
    super(apiKey);
  }

  /**
   * Get ESG disclosures for a symbol
   * @param symbol The stock symbol
   * @param limit Optional limit on number of results
   * @param options Optional parameters including abort signal and context
   * @returns Array of ESG disclosures
   */
  async getDisclosures(
    symbol: string,
    limit?: number,
    options?: {
      signal?: AbortSignal;
      context?: FMPContext;
    }
  ): Promise<ESGDisclosure[]> {
    return super.get<ESGDisclosure[]>(
      "/esg-disclosure",
      { symbol, limit },
      options
    );
  }

  /**
   * Get ESG ratings for a symbol
   * @param symbol The stock symbol
   * @param options Optional parameters including abort signal and context
   * @returns Array of ESG ratings
   */
  async getRatings(
    symbol: string,
    options?: {
      signal?: AbortSignal;
      context?: FMPContext;
    }
  ): Promise<ESGRating[]> {
    return super.get<ESGRating[]>("/esg-rating", { symbol }, options);
  }

  /**
   * Get ESG benchmarks for a sector
   * @param sector The sector to get benchmarks for
   * @param year Optional year to get benchmarks for
   * @param options Optional parameters including abort signal and context
   * @returns Array of ESG benchmarks
   */
  async getBenchmarks(
    sector: string,
    year?: string,
    options?: {
      signal?: AbortSignal;
      context?: FMPContext;
    }
  ): Promise<ESGBenchmark[]> {
    return super.get<ESGBenchmark[]>(
      "/esg-benchmark",
      { sector, year },
      options
    );
  }
}
