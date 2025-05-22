import { FMPClient } from "../FMPClient.js";
import { ESGDisclosure, ESGRating, ESGBenchmark } from "./types.js";

export class ESGClient extends FMPClient {
  constructor(apiKey: string) {
    super(apiKey);
  }

  /**
   * Get ESG disclosures for a symbol
   * @param symbol The stock symbol
   * @param limit Optional limit on number of results
   * @returns Array of ESG disclosures
   */
  async getDisclosures(
    symbol: string,
    limit?: number
  ): Promise<ESGDisclosure[]> {
    return super.get<ESGDisclosure[]>("/esg-disclosure", { symbol, limit });
  }

  /**
   * Get ESG ratings for a symbol
   * @param symbol The stock symbol
   * @returns Array of ESG ratings
   */
  async getRatings(symbol: string): Promise<ESGRating[]> {
    return super.get<ESGRating[]>("/esg-rating", { symbol });
  }

  /**
   * Get ESG benchmarks for a sector
   * @param sector The sector to get benchmarks for
   * @param year Optional year to get benchmarks for
   * @returns Array of ESG benchmarks
   */
  async getBenchmarks(sector: string, year?: string): Promise<ESGBenchmark[]> {
    return super.get<ESGBenchmark[]>("/esg-benchmark", { sector, year });
  }
}
