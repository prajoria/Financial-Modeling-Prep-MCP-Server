import { FMPClient } from "../FMPClient.js";
import {
  FinancialDisclosure,
  PaginationParams,
  SymbolParams,
  NameParams,
} from "./types.js";

export class GovernmentTradingClient extends FMPClient {
  /**
   * Get latest financial disclosures from U.S. Senate members
   */
  async getLatestSenateDisclosures(
    params: PaginationParams = {}
  ): Promise<FinancialDisclosure[]> {
    return this.get<FinancialDisclosure[]>(`/senate-latest`, {
      page: params.page,
      limit: params.limit,
    });
  }

  /**
   * Get latest financial disclosures from U.S. House members
   */
  async getLatestHouseDisclosures(
    params: PaginationParams = {}
  ): Promise<FinancialDisclosure[]> {
    return this.get<FinancialDisclosure[]>(`/house-latest`, {
      page: params.page,
      limit: params.limit,
    });
  }

  /**
   * Get Senate trading activity for a specific symbol
   */
  async getSenateTrades(params: SymbolParams): Promise<FinancialDisclosure[]> {
    return this.get<FinancialDisclosure[]>(`/senate-trades`, {
      symbol: params.symbol,
    });
  }

  /**
   * Get Senate trades by senator name
   */
  async getSenateTradesByName(
    params: NameParams
  ): Promise<FinancialDisclosure[]> {
    return this.get<FinancialDisclosure[]>(`/senate-trades-by-name`, {
      name: params.name,
    });
  }

  /**
   * Get House trading activity for a specific symbol
   */
  async getHouseTrades(params: SymbolParams): Promise<FinancialDisclosure[]> {
    return this.get<FinancialDisclosure[]>(`/house-trades`, {
      symbol: params.symbol,
    });
  }

  /**
   * Get House trades by representative name
   */
  async getHouseTradesByName(
    params: NameParams
  ): Promise<FinancialDisclosure[]> {
    return this.get<FinancialDisclosure[]>(`/house-trades-by-name`, {
      name: params.name,
    });
  }
}
