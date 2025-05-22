import { FMPClient } from "../FMPClient.js";
import {
  DCFValuation,
  LeveredDCF,
  CustomDCFInput,
  CustomDCFOutput,
} from "./types.js";

export class DCFClient extends FMPClient {
  constructor(apiKey: string) {
    super(apiKey);
  }

  /**
   * Get DCF(Discounted Cash Flow) valuation for a symbol
   * @param symbol The stock symbol
   * @returns DCF valuation data
   */
  async getValuation(symbol: string): Promise<DCFValuation> {
    return super.get<DCFValuation>("/dcf", { symbol });
  }

  /**
   * Get levered DCF(Discounted Cash Flow) valuation for a symbol
   * @param symbol The stock symbol
   * @returns Levered DCF valuation data
   */
  async getLeveredValuation(symbol: string): Promise<LeveredDCF> {
    return super.get<LeveredDCF>("/dcf-levered", { symbol });
  }

  /**
   * Calculate custom DCF valuation
   * @param input Custom DCF input parameters
   * @returns Custom DCF output data
   */
  async calculateCustomDCF(input: CustomDCFInput): Promise<CustomDCFOutput> {
    return super.post<CustomDCFOutput>("/dcf-custom", input);
  }
}
