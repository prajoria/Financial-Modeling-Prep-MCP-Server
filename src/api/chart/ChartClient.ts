import { FMPClient } from "../FMPClient.js";
import {
  ChartData,
  LightChartData,
  UnadjustedChartData,
  DividendAdjustedChartData,
  Interval,
} from "./types.js";

export class ChartClient extends FMPClient {
  constructor(apiKey: string) {
    super(apiKey);
  }

  /**
   * Get light chart data for a stock symbol
   * @param symbol Stock symbol
   * @returns Array of light chart data
   */
  async getLightChart(symbol: string): Promise<LightChartData[]> {
    return super.get<LightChartData[]>("/historical-price-eod/light", {
      symbol,
    });
  }

  /**
   * Get full chart data for a stock symbol
   * @param symbol Stock symbol
   * @returns Array of chart data
   */
  async getFullChart(symbol: string): Promise<ChartData[]> {
    return super.get<ChartData[]>("/historical-price-eod/full", { symbol });
  }

  /**
   * Get unadjusted chart data for a stock symbol
   * @param symbol Stock symbol
   * @returns Array of unadjusted chart data
   */
  async getUnadjustedChart(symbol: string): Promise<UnadjustedChartData[]> {
    return super.get<UnadjustedChartData[]>(
      "/historical-price-eod/non-split-adjusted",
      { symbol }
    );
  }

  /**
   * Get dividend-adjusted chart data for a stock symbol
   * @param symbol Stock symbol
   * @returns Array of dividend-adjusted chart data
   */
  async getDividendAdjustedChart(
    symbol: string
  ): Promise<DividendAdjustedChartData[]> {
    return super.get<DividendAdjustedChartData[]>(
      "/historical-price-eod/dividend-adjusted",
      { symbol }
    );
  }

  /**
   * Get intraday chart data for a stock symbol
   * @param symbol Stock symbol
   * @param interval Time interval (1min, 5min, 15min, 30min, 1hour, 4hour)
   * @returns Array of chart data
   */
  async getIntradayChart(
    symbol: string,
    interval: Interval
  ): Promise<ChartData[]> {
    return super.get<ChartData[]>(`/historical-chart/${interval}`, { symbol });
  }
}
