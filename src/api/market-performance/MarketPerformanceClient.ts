import { FMPClient } from "../FMPClient.js";
import {
  SectorPerformance,
  IndustryPerformance,
  SectorPE,
  IndustryPE,
  StockMovement,
} from "./types.js";

export class MarketPerformanceClient extends FMPClient {
  /**
   * Get market sector performance snapshot
   */
  async getSectorPerformanceSnapshot(
    date: string,
    params: { exchange?: string; sector?: string } = {}
  ): Promise<SectorPerformance[]> {
    return super.get<SectorPerformance[]>("/sector-performance-snapshot", {
      date,
      ...params,
    });
  }

  /**
   * Get industry performance snapshot
   */
  async getIndustryPerformanceSnapshot(
    date: string,
    params: { exchange?: string; industry?: string } = {}
  ): Promise<IndustryPerformance[]> {
    return super.get<IndustryPerformance[]>("/industry-performance-snapshot", {
      date,
      ...params,
    });
  }

  /**
   * Get historical market sector performance
   */
  async getHistoricalSectorPerformance(
    sector: string,
    params: { from?: string; to?: string; exchange?: string } = {}
  ): Promise<SectorPerformance[]> {
    return super.get<SectorPerformance[]>("/historical-sector-performance", {
      sector,
      ...params,
    });
  }

  /**
   * Get historical industry performance
   */
  async getHistoricalIndustryPerformance(
    industry: string,
    params: { from?: string; to?: string; exchange?: string } = {}
  ): Promise<IndustryPerformance[]> {
    return super.get<IndustryPerformance[]>(
      "/historical-industry-performance",
      {
        industry,
        ...params,
      }
    );
  }

  /**
   * Get sector PE snapshot
   */
  async getSectorPESnapshot(
    date: string,
    params: { exchange?: string; sector?: string } = {}
  ): Promise<SectorPE[]> {
    return super.get<SectorPE[]>("/sector-pe-snapshot", {
      date,
      ...params,
    });
  }

  /**
   * Get industry PE snapshot
   */
  async getIndustryPESnapshot(
    date: string,
    params: { exchange?: string; industry?: string } = {}
  ): Promise<IndustryPE[]> {
    return super.get<IndustryPE[]>("/industry-pe-snapshot", {
      date,
      ...params,
    });
  }

  /**
   * Get historical sector PE
   */
  async getHistoricalSectorPE(
    sector: string,
    params: { from?: string; to?: string; exchange?: string } = {}
  ): Promise<SectorPE[]> {
    return super.get<SectorPE[]>("/historical-sector-pe", {
      sector,
      ...params,
    });
  }

  /**
   * Get historical industry PE
   */
  async getHistoricalIndustryPE(
    industry: string,
    params: { from?: string; to?: string; exchange?: string } = {}
  ): Promise<IndustryPE[]> {
    return super.get<IndustryPE[]>("/historical-industry-pe", {
      industry,
      ...params,
    });
  }

  /**
   * Get biggest stock gainers
   */
  async getBiggestGainers(): Promise<StockMovement[]> {
    return super.get<StockMovement[]>("/biggest-gainers");
  }

  /**
   * Get biggest stock losers
   */
  async getBiggestLosers(): Promise<StockMovement[]> {
    return super.get<StockMovement[]>("/biggest-losers");
  }

  /**
   * Get most active stocks
   */
  async getMostActiveStocks(): Promise<StockMovement[]> {
    return super.get<StockMovement[]>("/most-actives");
  }
}
