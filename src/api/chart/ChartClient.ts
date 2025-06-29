import { FMPClient } from "../FMPClient.js";
import type { FMPContext } from "../../types/index.js";
import {
  ChartData,
  LightChartData,
  UnadjustedChartData,
  DividendAdjustedChartData,
  Interval,
} from "./types.js";



export class ChartClient extends FMPClient {
  constructor(apiKey?: string) {
    super(apiKey);
  }

  /**
   * Get light chart data for a stock symbol
   * @param symbol Stock symbol
   * @param options Optional parameters including abort signal and context
   * @returns Array of light chart data
   */
  async getLightChart(
    symbol: string,
    options?: {
      signal?: AbortSignal;
      context?: FMPContext;
    }
  ): Promise<LightChartData[]> {
    return super.get<LightChartData[]>(
      "/historical-price-eod/light",
      {
        symbol,
      },
      options
    );
  }

  /**
   * Get full chart data for a stock symbol
   * @param symbol Stock symbol
   * @param options Optional parameters including abort signal and context
   * @returns Array of chart data
   */
  async getFullChart(
    symbol: string,
    options?: {
      signal?: AbortSignal;
      context?: FMPContext;
    }
  ): Promise<ChartData[]> {
    return super.get<ChartData[]>(
      "/historical-price-eod/full",
      { symbol },
      options
    );
  }

  /**
   * Get unadjusted chart data for a stock symbol
   * @param symbol Stock symbol
   * @param options Optional parameters including abort signal and context
   * @returns Array of unadjusted chart data
   */
  async getUnadjustedChart(
    symbol: string,
    options?: {
      signal?: AbortSignal;
      context?: FMPContext;
    }
  ): Promise<UnadjustedChartData[]> {
    return super.get<UnadjustedChartData[]>(
      "/historical-price-eod/non-split-adjusted",
      { symbol },
      options
    );
  }

  /**
   * Get dividend-adjusted chart data for a stock symbol
   * @param symbol Stock symbol
   * @param options Optional parameters including abort signal and context
   * @returns Array of dividend-adjusted chart data
   */
  async getDividendAdjustedChart(
    symbol: string,
    options?: {
      signal?: AbortSignal;
      context?: FMPContext;
    }
  ): Promise<DividendAdjustedChartData[]> {
    return super.get<DividendAdjustedChartData[]>(
      "/historical-price-eod/dividend-adjusted",
      { symbol },
      options
    );
  }

  /**
   * Get intraday chart data for a stock symbol
   * @param symbol Stock symbol
   * @param interval Time interval (1min, 5min, 15min, 30min, 1hour, 4hour)
   * @param options Optional parameters including abort signal and context
   * @returns Array of chart data
   */
  async getIntradayChart(
    symbol: string,
    interval: Interval,
    options?: {
      signal?: AbortSignal;
      context?: FMPContext;
    }
  ): Promise<ChartData[]> {
    return super.get<ChartData[]>(
      `/historical-chart/${interval}`,
      { symbol },
      options
    );
  }
}
