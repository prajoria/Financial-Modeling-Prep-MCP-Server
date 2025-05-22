import { FMPClient } from "../FMPClient.js";
import { COTReport, COTAnalysis, COTList } from "./types.js";

export class COTClient extends FMPClient {
  constructor(apiKey: string) {
    super(apiKey);
  }

  /**
   * Get COT(Commitment Of Traders) reports for a symbol
   * @param symbol The commodity symbol
   * @param limit Optional limit on number of results
   * @returns Array of COT reports
   */
  async getReports(symbol: string, limit?: number): Promise<COTReport[]> {
    return super.get<COTReport[]>("/cot", { symbol, limit });
  }

  /**
   * Get COT(Commitment Of Traders) analysis for a symbol
   * @param symbol The commodity symbol
   * @param limit Optional limit on number of results
   * @returns Array of COT analysis
   */
  async getAnalysis(symbol: string, limit?: number): Promise<COTAnalysis[]> {
    return super.get<COTAnalysis[]>("/cot-analysis", { symbol, limit });
  }

  /**
   * Get list of available COT(Commitment Of Traders) reports
   * @returns Array of available COT reports
   */
  async getList(): Promise<COTList[]> {
    return super.get<COTList[]>("/cot-list");
  }
}
