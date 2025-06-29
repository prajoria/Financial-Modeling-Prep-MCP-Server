import { FMPClient } from "../FMPClient.js";
import type { FMPContext } from "../../types/index.js";
import { COTReport, COTAnalysis, COTList } from "./types.js";

export class COTClient extends FMPClient {
  constructor(apiKey?: string) {
    super(apiKey);
  }

  /**
   * Get COT(Commitment Of Traders) reports for a symbol
   * @param symbol The commodity symbol
   * @param limit Optional limit on number of results
   * @param options Optional parameters including abort signal and context
   * @returns Array of COT reports
   */
  async getReports(
    symbol: string,
    limit?: number,
    options?: {
      signal?: AbortSignal;
      context?: FMPContext;
    }
  ): Promise<COTReport[]> {
    return super.get<COTReport[]>("/cot", { symbol, limit }, options);
  }

  /**
   * Get COT(Commitment Of Traders) analysis for a symbol
   * @param symbol The commodity symbol
   * @param limit Optional limit on number of results
   * @param options Optional parameters including abort signal and context
   * @returns Array of COT analysis
   */
  async getAnalysis(
    symbol: string,
    limit?: number,
    options?: {
      signal?: AbortSignal;
      context?: FMPContext;
    }
  ): Promise<COTAnalysis[]> {
    return super.get<COTAnalysis[]>(
      "/cot-analysis",
      { symbol, limit },
      options
    );
  }

  /**
   * Get list of available COT(Commitment Of Traders) reports
   * @param options Optional parameters including abort signal and context
   * @returns Array of available COT reports
   */
  async getList(options?: {
    signal?: AbortSignal;
    context?: FMPContext;
  }): Promise<COTList[]> {
    return super.get<COTList[]>("/cot-list", {}, options);
  }
}
