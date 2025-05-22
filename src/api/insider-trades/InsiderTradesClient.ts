import { FMPClient } from "../FMPClient.js";
import {
  InsiderTrading,
  InsiderReportingName,
  InsiderTransactionType,
  InsiderTradeStatistics,
  AcquisitionOwnership,
} from "./types.js";

export class InsiderTradesClient extends FMPClient {
  /**
   * Get latest insider trading activities
   */
  async getLatestInsiderTrading(
    params: { date?: string; page?: number; limit?: number } = {}
  ): Promise<InsiderTrading[]> {
    return super.get<InsiderTrading[]>("/insider-trading/latest", params);
  }

  /**
   * Search insider trades by various criteria
   */
  async searchInsiderTrades(
    params: {
      symbol?: string;
      page?: number;
      limit?: number;
      reportingCik?: string;
      companyCik?: string;
      transactionType?: string;
    } = {}
  ): Promise<InsiderTrading[]> {
    return super.get<InsiderTrading[]>("/insider-trading/search", params);
  }

  /**
   * Search insider trades by reporting name
   */
  async searchInsiderTradesByReportingName(
    name: string
  ): Promise<InsiderReportingName[]> {
    return super.get<InsiderReportingName[]>(
      "/insider-trading/reporting-name",
      { name }
    );
  }

  /**
   * Get all insider transaction types
   */
  async getInsiderTransactionTypes(): Promise<InsiderTransactionType[]> {
    return super.get<InsiderTransactionType[]>(
      "/insider-trading-transaction-type"
    );
  }

  /**
   * Get insider trade statistics for a symbol
   */
  async getInsiderTradeStatistics(
    symbol: string
  ): Promise<InsiderTradeStatistics[]> {
    return super.get<InsiderTradeStatistics[]>("/insider-trading/statistics", {
      symbol,
    });
  }

  /**
   * Get acquisition ownership information for a symbol
   */
  async getAcquisitionOwnership(
    symbol: string,
    limit?: number
  ): Promise<AcquisitionOwnership[]> {
    const params: Record<string, any> = { symbol };
    if (limit !== undefined) {
      params.limit = limit;
    }
    return super.get<AcquisitionOwnership[]>(
      "/acquisition-of-beneficial-ownership",
      params
    );
  }
}
