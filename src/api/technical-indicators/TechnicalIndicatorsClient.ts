import { FMPClient } from "../FMPClient.js";
import {
  TechnicalIndicatorParams,
  SMAIndicator,
  EMAIndicator,
  WMAIndicator,
  DEMAIndicator,
  TEMAIndicator,
  RSIIndicator,
  StandardDeviationIndicator,
  WilliamsIndicator,
  ADXIndicator,
} from "./types.js";

export class TechnicalIndicatorsClient extends FMPClient {
  /**
   * Get Simple Moving Average (SMA) indicator
   */
  async getSMA(params: TechnicalIndicatorParams): Promise<SMAIndicator[]> {
    return super.get<SMAIndicator[]>("/technical-indicators/sma", params);
  }

  /**
   * Get Exponential Moving Average (EMA) indicator
   */
  async getEMA(params: TechnicalIndicatorParams): Promise<EMAIndicator[]> {
    return super.get<EMAIndicator[]>("/technical-indicators/ema", params);
  }

  /**
   * Get Weighted Moving Average (WMA) indicator
   */
  async getWMA(params: TechnicalIndicatorParams): Promise<WMAIndicator[]> {
    return super.get<WMAIndicator[]>("/technical-indicators/wma", params);
  }

  /**
   * Get Double Exponential Moving Average (DEMA) indicator
   */
  async getDEMA(params: TechnicalIndicatorParams): Promise<DEMAIndicator[]> {
    return super.get<DEMAIndicator[]>("/technical-indicators/dema", params);
  }

  /**
   * Get Triple Exponential Moving Average (TEMA) indicator
   */
  async getTEMA(params: TechnicalIndicatorParams): Promise<TEMAIndicator[]> {
    return super.get<TEMAIndicator[]>("/technical-indicators/tema", params);
  }

  /**
   * Get Relative Strength Index (RSI) indicator
   */
  async getRSI(params: TechnicalIndicatorParams): Promise<RSIIndicator[]> {
    return super.get<RSIIndicator[]>("/technical-indicators/rsi", params);
  }

  /**
   * Get Standard Deviation indicator
   */
  async getStandardDeviation(
    params: TechnicalIndicatorParams
  ): Promise<StandardDeviationIndicator[]> {
    return super.get<StandardDeviationIndicator[]>(
      "/technical-indicators/standarddeviation",
      params
    );
  }

  /**
   * Get Williams %R indicator
   */
  async getWilliams(
    params: TechnicalIndicatorParams
  ): Promise<WilliamsIndicator[]> {
    return super.get<WilliamsIndicator[]>(
      "/technical-indicators/williams",
      params
    );
  }

  /**
   * Get Average Directional Index (ADX) indicator
   */
  async getADX(params: TechnicalIndicatorParams): Promise<ADXIndicator[]> {
    return super.get<ADXIndicator[]>("/technical-indicators/adx", params);
  }
}
