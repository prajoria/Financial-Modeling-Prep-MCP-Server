import { FMPClient } from "../FMPClient.js";
import type { FMPContext } from "../../types/index.js";
import type {
  Commodity
} from "./types.js";

export class CommodityClient extends FMPClient {
  constructor(apiKey?: string) {
    super(apiKey);
  }

  /**
   * Get list of commodities
   * @param options Optional parameters including abort signal and context
   * @returns Array of commodities
   */
  async listCommodities(
    options?: {
      signal?: AbortSignal;
      context?: FMPContext;
    }
  ): Promise<Commodity[]> {
    return super.get<Commodity[]>("/commodity-list", {}, options);
  } 
}
